# Start Postgres + Medusa + Strapi + Storefront (each app in its own window).
#
# Usage:
#   .\start-all.ps1              # start apps only
#   .\start-all.ps1 -Seed        # also run CMS + Medusa seed scripts
#   .\start-all.ps1 -Seed -SkipWarm
#
# Requires: Docker Desktop, Node >= 20, deps already installed.

param(
  [switch]$Seed,
  [switch]$SkipWarm
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

function Wait-HttpOk {
  param(
    [string]$Url,
    [int]$TimeoutSec = 180,
    [hashtable]$Headers = @{}
  )
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    try {
      $r = Invoke-WebRequest -Uri $Url -Headers $Headers -UseBasicParsing -TimeoutSec 5
      if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) {
        return $true
      }
    } catch { }
    Start-Sleep -Seconds 2
  }
  return $false
}

function Invoke-SqlSeed {
  param([string]$RelativePath)
  $src = Join-Path $Root $RelativePath
  if (-not (Test-Path $src)) {
    Write-Warning "Missing seed file: $src"
    return
  }
  $name = Split-Path $src -Leaf
  Write-Host "  SQL seed: $name"
  docker cp $src "tlcv-postgres:/tmp/$name" | Out-Null
  docker exec tlcv-postgres psql -U postgres -d medusa -v ON_ERROR_STOP=1 -f "/tmp/$name" | Out-Null
}

Write-Host ""
Write-Host "=== Thang Long Che Viet — start all ===" -ForegroundColor Cyan
Write-Host "Root: $Root"
Write-Host ""

# --- Postgres ---
Write-Host "==> [1/5] Postgres (Docker)..."
docker compose -f "$Root\infra\docker-compose.db.yml" --env-file "$Root\.env.dev" up -d | Out-Null

$pgDeadline = (Get-Date).AddMinutes(2)
do {
  $pgHealth = docker inspect tlcv-postgres --format "{{.State.Health.Status}}" 2>$null
  if ($pgHealth -eq "healthy") { break }
  Start-Sleep -Seconds 2
} while ((Get-Date) -lt $pgDeadline)

if ($pgHealth -ne "healthy") {
  throw "Postgres did not become healthy (status=$pgHealth). Is Docker Desktop running?"
}
Write-Host "    Postgres healthy."

# --- Optional SQL seeds (before apps start is fine for Strapi tables) ---
if ($Seed) {
  Write-Host "==> [seed] Strapi SQL (UTF-8 via docker cp)..."
  Invoke-SqlSeed "infra\postgres\seed-strapi-demo.sql"
  Invoke-SqlSeed "infra\postgres\seed-strapi-bulk.sql"
  Invoke-SqlSeed "infra\postgres\seed-home-campaigns.sql"
  Write-Host "    Strapi SQL done."
}

# --- Kill stale listeners on app ports (optional cleanup) ---
foreach ($port in 9000, 1337, 8000) {
  $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($c in $conns) {
    $procId = $c.OwningProcess
    Write-Host "    Freeing port $port (PID $procId)..."
    taskkill /PID $procId /T /F 2>$null | Out-Null
  }
}
Start-Sleep -Seconds 1

# --- Launch apps in separate windows ---
Write-Host "==> [2/5] Starting Medusa (new window)..."
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$Root\apps\backend'; Write-Host 'Medusa :9000' -ForegroundColor Green; npm run dev"
)

Write-Host "==> [3/5] Starting Strapi (new window)..."
$strapiCmd = @"
Set-Location '$Root\strapi'
Write-Host 'Strapi :1337' -ForegroundColor Green
if (Test-Path dist) { npm run start } else { npm run start:api }
"@
Start-Process powershell -ArgumentList @("-NoExit", "-Command", $strapiCmd)

Write-Host "==> [4/5] Starting Storefront (new window)..."
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$Root\apps\storefront'; Write-Host 'Storefront :8000' -ForegroundColor Green; npm run dev"
)

# --- Wait until apps respond ---
Write-Host "==> Waiting for Medusa :9000 ..."
if (-not (Wait-HttpOk "http://127.0.0.1:9000/health" 240)) {
  Write-Warning "Medusa not ready in time — continue anyway."
} else {
  Write-Host "    Medusa ready."
}

Write-Host "==> Waiting for Strapi :1337 ..."
if (-not (Wait-HttpOk "http://127.0.0.1:1337/_health" 240)) {
  Write-Warning "Strapi not ready in time — continue anyway."
} else {
  Write-Host "    Strapi ready."
}

# --- Medusa product seeds (need running / executable Medusa) ---
if ($Seed) {
  Write-Host "==> [seed] Medusa tea catalog..."
  Push-Location "$Root\apps\backend"
  try {
    npx medusa exec ./src/scripts/seed-tea-catalog.ts
    npx medusa exec ./src/scripts/seed-tea-bulk.ts
    npx medusa exec ./src/scripts/unpublish-demo-apparel.ts
  } finally {
    Pop-Location
  }
  Write-Host "    Medusa seeds done."
}

Write-Host "==> Waiting for Storefront :8000 ..."
if (-not (Wait-HttpOk "http://127.0.0.1:8000/vn" 240)) {
  Write-Warning "Storefront not ready in time — open later."
} else {
  Write-Host "    Storefront ready."
}

# --- Warm ---
if (-not $SkipWarm -and (Test-Path "$Root\scripts\warm-apis.mjs")) {
  Write-Host "==> [5/5] Warming APIs..."
  Push-Location $Root
  try { node scripts\warm-apis.mjs } catch { Write-Warning $_.Exception.Message }
  Pop-Location
}

Write-Host ""
Write-Host "=== Ready ===" -ForegroundColor Green
Write-Host "  Storefront   http://localhost:8000/vn"
Write-Host "  Medusa Admin http://localhost:9000/app"
Write-Host "  Strapi Admin http://localhost:1337/admin"
Write-Host ""
Write-Host "  Medusa login: admin@medusa.local / supersecret123"
Write-Host "  Strapi login: your admin user (see RUN.md to reset)"
Write-Host ""
Write-Host "Three PowerShell windows were opened (Medusa / Strapi / Storefront)."
Write-Host "Close those windows or Ctrl+C to stop each app."
Write-Host ""
if (-not $Seed) {
  Write-Host "Tip: first-time or empty DB? re-run with:  .\start-all.ps1 -Seed" -ForegroundColor Yellow
}
