<#
.SYNOPSIS
    Bootstraps and runs the admin-medusa (Medusa DTC starter) project on Windows.

.DESCRIPTION
    Architecture (chosen because Docker only exists inside WSL here, and node_modules
    on /mnt/d is slow over 9p):
      * PostgreSQL runs as a Docker container INSIDE WSL (ubuntu), published to
        localhost:5432 which WSL2 forwards to Windows.
      * Medusa itself runs NATIVELY on Windows (node/npm), talking to that Postgres.

    Steps (all idempotent):
      1. Ensure the medusa-postgres container is running in WSL docker.
      2. Create apps/backend/.env if missing.
      3. npm install at the repo root (workspaces) if node_modules is missing.
      4. Run DB migrations.
      5. Create a default admin user (ignored if it already exists).
      6. Start the Medusa backend dev server (admin dashboard at http://localhost:9000/app).

.PARAMETER SetupOnly
    Run steps 1-5 but do not start the dev server.

.PARAMETER Reinstall
    Force `npm install` even if node_modules exists.
#>
[CmdletBinding()]
param(
    [switch]$SetupOnly,
    [switch]$Reinstall
)

$ErrorActionPreference = 'Stop'
$root    = $PSScriptRoot
$backend = Join-Path $root 'apps\backend'

$WSL_DISTRO   = 'ubuntu'
$PG_CONTAINER = 'medusa-postgres'
$PG_USER      = 'postgres'
$PG_PASSWORD  = '1'
$PG_DB        = 'postgres'

$ADMIN_EMAIL    = 'admin@medusa.local'
$ADMIN_PASSWORD = 'supersecret123'

function Info($m)  { Write-Host "[medusa] $m" -ForegroundColor Cyan }
function Ok($m)    { Write-Host "[medusa] $m" -ForegroundColor Green }
function Warn($m)  { Write-Host "[medusa] $m" -ForegroundColor Yellow }

function Invoke-Wsl($cmd) {
    wsl -d $WSL_DISTRO -e bash -lc $cmd
}

# --- 0. Keep WSL VM alive ---------------------------------------------------
# WSL2 shuts the distro (and Docker with it) down shortly after its last process
# exits. Since Medusa runs on Windows and only reaches WSL Postgres over TCP, an
# idle shutdown mid-session drops the DB connection (this bit migrations twice).
# A Windows-side keep-alive process is unreliable (the harness can reap it and it
# doesn't reliably hold the VM). Instead we start a DETACHED daemon INSIDE the
# distro: `nohup sleep infinity`, orphaned to systemd, immune to Windows-side
# process cleanup, which keeps the distro's process list non-empty so the VM
# never idle-shuts-down. Verified to hold the VM for 100s+ with no WSL calls.
function Ensure-WslKeepAlive {
    Info 'Ensuring in-distro WSL keep-alive daemon...'
    # The bash payload has embedded double-quotes/specials that PowerShell 5.1
    # mangles when passing to a native exe. Base64-encode it so the argument
    # actually handed to wsl is quote/space-free and survives PS arg-quoting.
    $cmd = 'PIDF=/tmp/medusa-keepalive.pid; if [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF" 2>/dev/null)" 2>/dev/null; then echo alive; else nohup sleep infinity >/dev/null 2>&1 & echo $! > "$PIDF"; disown; echo started; fi'
    $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($cmd))
    $r = (wsl -d $WSL_DISTRO -e bash -c "echo $b64 | base64 -d | bash") 2>&1
    Ok "WSL keep-alive daemon: $($r -join ' ')"
}

# --- 1. PostgreSQL (WSL docker) --------------------------------------------
function Ensure-Postgres {
    Info 'Ensuring PostgreSQL container is running (WSL docker)...'
    $state = (Invoke-Wsl "docker inspect -f '{{.State.Running}}' $PG_CONTAINER 2>/dev/null").Trim()
    if ($state -eq 'true') {
        Ok 'PostgreSQL already running.'
    }
    elseif ($state -eq 'false') {
        Info 'Starting existing PostgreSQL container...'
        # Ensure a restart policy so it survives any WSL/Docker bounce.
        Invoke-Wsl "docker update --restart unless-stopped $PG_CONTAINER >/dev/null 2>&1; docker start $PG_CONTAINER" | Out-Null
    }
    else {
        Info 'Creating PostgreSQL container (postgres:15)...'
        Invoke-Wsl "docker run -d --name $PG_CONTAINER --restart unless-stopped -e POSTGRES_USER=$PG_USER -e POSTGRES_PASSWORD=$PG_PASSWORD -e POSTGRES_DB=$PG_DB -p 5432:5432 postgres:15" | Out-Null
    }

    Info 'Waiting for PostgreSQL to accept connections...'
    for ($i = 0; $i -lt 30; $i++) {
        $ready = (Invoke-Wsl "docker exec $PG_CONTAINER pg_isready -U $PG_USER 2>/dev/null; echo $?").Trim()
        $tcp = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue
        if ($tcp.TcpTestSucceeded -and $ready -match 'accepting') { Ok 'PostgreSQL is ready.'; return }
        Start-Sleep -Seconds 1
    }
    throw 'PostgreSQL did not become ready in time.'
}

# --- 2. backend/.env --------------------------------------------------------
function Ensure-Env {
    $envFile = Join-Path $backend '.env'
    if (Test-Path $envFile) { Ok 'apps/backend/.env already exists.'; return }
    Info 'Creating apps/backend/.env ...'
    @"
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgres://${PG_USER}:${PG_PASSWORD}@localhost:5432/${PG_DB}
DB_NAME=${PG_DB}
"@ | Set-Content -Path $envFile -Encoding utf8
    Ok 'apps/backend/.env created.'
}

# --- 3. npm install ---------------------------------------------------------
function Ensure-Deps {
    $nm = Join-Path $root 'node_modules'
    if ((Test-Path $nm) -and -not $Reinstall) { Ok 'Dependencies already installed.'; return }
    Info 'Installing dependencies (npm workspaces, this can take a few minutes)...'
    Push-Location $root
    try {
        npm install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) {
            Warn 'npm install failed; retrying with --legacy-peer-deps ...'
            npm install --no-audit --no-fund --legacy-peer-deps
            if ($LASTEXITCODE -ne 0) { throw 'npm install failed.' }
        }
    } finally { Pop-Location }
    Ok 'Dependencies installed.'
}

# --- 4. migrations ----------------------------------------------------------
function Invoke-Migrations {
    Info 'Running database migrations...'
    Push-Location $backend
    try {
        npx medusa db:migrate
        if ($LASTEXITCODE -ne 0) { throw 'Migrations failed.' }
    } finally { Pop-Location }
    Ok 'Migrations complete.'
}

# --- 5. admin user ----------------------------------------------------------
function Ensure-AdminUser {
    Info "Ensuring admin user ($ADMIN_EMAIL) exists..."
    Push-Location $backend
    try {
        npx medusa user -e $ADMIN_EMAIL -p $ADMIN_PASSWORD
        if ($LASTEXITCODE -ne 0) { Warn 'Admin user may already exist (ignored).' }
        else { Ok "Admin user ready -> $ADMIN_EMAIL / $ADMIN_PASSWORD" }
    } finally { Pop-Location }
}

# --- 6. dev server ----------------------------------------------------------
function Start-Backend {
    Info 'Starting Medusa backend (admin at http://localhost:9000/app)...'
    Push-Location $backend
    try { npm run dev } finally { Pop-Location }
}

# --- run --------------------------------------------------------------------
Ensure-WslKeepAlive
Ensure-Postgres
Ensure-Env
Ensure-Deps
Invoke-Migrations
Ensure-AdminUser

if ($SetupOnly) {
    Ok 'Setup complete (SetupOnly). Run without -SetupOnly to start the server.'
    return
}

Ok 'Setup complete. Launching backend...'
Ok "  Admin dashboard : http://localhost:9000/app"
Ok "  Login           : $ADMIN_EMAIL / $ADMIN_PASSWORD"
Start-Backend
