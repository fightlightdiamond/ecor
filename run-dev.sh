#!/usr/bin/env bash
#
# Bootstraps and runs the admin-medusa (Medusa DTC starter) project.
#
# TARGET SHELL: Git Bash on Windows (MSYS). This mirrors run-dev.ps1 and keeps
# the same architecture, chosen because Docker only exists inside WSL here and
# node_modules on /mnt/d is slow over 9p:
#   * PostgreSQL runs as a Docker container INSIDE WSL (ubuntu), published to
#     localhost:5432 which WSL2 forwards to Windows.
#   * Medusa itself runs NATIVELY on Windows (node/npm via Git Bash), talking to
#     that Postgres.
#
# Do NOT run this from inside WSL: the node_modules are installed with Windows
# native binaries and won't work under Linux (install a separate copy there if
# you really want to).
#
# Steps (all idempotent):
#   0. Keep the WSL VM alive with an in-distro daemon (prevents idle shutdown,
#      which otherwise drops the DB connection mid-work).
#   1. Ensure the medusa-postgres container is running in WSL docker.
#   2. Create apps/backend/.env if missing.
#   3. npm install at the repo root (workspaces) if node_modules is missing.
#   4. Run DB migrations.
#   5. Create a default admin user (ignored if it already exists).
#   6. Start the Medusa backend dev server (admin at http://localhost:9000/app).
#
# Usage: ./run-dev.sh [--setup-only] [--reinstall]
#   --setup-only  Run steps 0-5 but do not start the dev server.
#   --reinstall   Force `npm install` even if node_modules exists.

set -euo pipefail

# Stop MSYS/Git Bash from rewriting POSIX-looking arguments (e.g. /tmp/...,
# {{.State.Running}}) when we hand command strings to the native wsl.exe.
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL='*'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$SCRIPT_DIR/apps/backend"

WSL="wsl.exe"
WSL_DISTRO="ubuntu"
PG_CONTAINER="medusa-postgres"
PG_USER="postgres"
PG_PASSWORD="1"
PG_DB="postgres"

ADMIN_EMAIL="admin@medusa.local"
ADMIN_PASSWORD="supersecret123"

SETUP_ONLY=0
REINSTALL=0
for arg in "$@"; do
  case "$arg" in
    --setup-only) SETUP_ONLY=1 ;;
    --reinstall)  REINSTALL=1 ;;
    -h|--help)    echo "Usage: $0 [--setup-only] [--reinstall]"; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

info() { printf '\033[36m[medusa]\033[0m %s\n' "$*"; }
ok()   { printf '\033[32m[medusa]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[medusa]\033[0m %s\n' "$*"; }

# Run an arbitrary bash snippet inside WSL. The snippet is base64-encoded so no
# quotes/spaces/special chars survive to be mangled by Git Bash or wsl.exe.
wsl_run() {
  local b64
  b64="$(printf '%s' "$1" | base64 | tr -d '\n')"
  "$WSL" -d "$WSL_DISTRO" -e bash -c "echo $b64 | base64 -d | bash"
}

# --- 0. Keep WSL VM alive ---------------------------------------------------
# WSL2 shuts the distro (and Docker with it) down shortly after its last process
# exits. An idle shutdown mid-session drops the DB connection. A detached daemon
# INSIDE the distro (nohup sleep infinity, orphaned to systemd) keeps the process
# list non-empty so the VM never idle-shuts-down, and it is immune to Windows-side
# process cleanup.
ensure_keepalive() {
  info "Ensuring in-distro WSL keep-alive daemon..."
  local out
  out="$(wsl_run 'PIDF=/tmp/medusa-keepalive.pid; if [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF" 2>/dev/null)" 2>/dev/null; then echo alive; else nohup sleep infinity >/dev/null 2>&1 & echo $! > "$PIDF"; disown; echo started; fi')"
  ok "WSL keep-alive daemon: $out"
}

# --- 1. PostgreSQL (WSL docker) --------------------------------------------
ensure_postgres() {
  info "Ensuring PostgreSQL container is running (WSL docker)..."
  local state
  state="$(wsl_run "docker inspect -f '{{.State.Running}}' $PG_CONTAINER 2>/dev/null" | tr -d '[:space:]' || true)"
  if [ "$state" = "true" ]; then
    ok "PostgreSQL already running."
  elif [ "$state" = "false" ]; then
    info "Starting existing PostgreSQL container..."
    wsl_run "docker update --restart unless-stopped $PG_CONTAINER >/dev/null 2>&1; docker start $PG_CONTAINER" >/dev/null
  else
    info "Creating PostgreSQL container (postgres:15)..."
    wsl_run "docker run -d --name $PG_CONTAINER --restart unless-stopped -e POSTGRES_USER=$PG_USER -e POSTGRES_PASSWORD=$PG_PASSWORD -e POSTGRES_DB=$PG_DB -p 5432:5432 postgres:15" >/dev/null
  fi

  info "Waiting for PostgreSQL to accept connections..."
  local i
  for i in $(seq 1 30); do
    if wsl_run "docker exec $PG_CONTAINER pg_isready -U $PG_USER 2>/dev/null" | grep -q "accepting"; then
      ok "PostgreSQL is ready."
      return 0
    fi
    sleep 1
  done
  echo "PostgreSQL did not become ready in time." >&2
  exit 1
}

# --- 2. backend/.env --------------------------------------------------------
ensure_env() {
  local envfile="$BACKEND/.env"
  if [ -f "$envfile" ]; then
    ok "apps/backend/.env already exists."
    return
  fi
  info "Creating apps/backend/.env ..."
  cat > "$envfile" <<EOF
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgres://${PG_USER}:${PG_PASSWORD}@localhost:5432/${PG_DB}
DB_NAME=${PG_DB}
EOF
  ok "apps/backend/.env created."
}

# --- 3. npm install ---------------------------------------------------------
ensure_deps() {
  if [ -d "$SCRIPT_DIR/node_modules" ] && [ "$REINSTALL" -eq 0 ]; then
    ok "Dependencies already installed."
    return
  fi
  info "Installing dependencies (npm workspaces, this can take a few minutes)..."
  (
    cd "$SCRIPT_DIR"
    npm install --no-audit --no-fund || {
      warn "npm install failed; retrying with --legacy-peer-deps ..."
      npm install --no-audit --no-fund --legacy-peer-deps
    }
  )
  ok "Dependencies installed."
}

# --- 4. migrations ----------------------------------------------------------
run_migrations() {
  info "Running database migrations..."
  ( cd "$BACKEND" && npx medusa db:migrate )
  ok "Migrations complete."
}

# --- 5. admin user ----------------------------------------------------------
ensure_admin_user() {
  info "Ensuring admin user ($ADMIN_EMAIL) exists..."
  if ( cd "$BACKEND" && npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" ); then
    ok "Admin user ready -> $ADMIN_EMAIL / $ADMIN_PASSWORD"
  else
    warn "Admin user may already exist (ignored)."
  fi
}

# --- 6. dev server ----------------------------------------------------------
start_backend() {
  info "Starting Medusa backend (admin at http://localhost:9000/app)..."
  cd "$BACKEND"
  npm run dev
}

# --- run --------------------------------------------------------------------
ensure_keepalive
ensure_postgres
ensure_env
ensure_deps
run_migrations
ensure_admin_user

if [ "$SETUP_ONLY" -eq 1 ]; then
  ok "Setup complete (--setup-only). Run without --setup-only to start the server."
  exit 0
fi

ok "Setup complete. Launching backend..."
ok "  Admin dashboard : http://localhost:9000/app"
ok "  Login           : $ADMIN_EMAIL / $ADMIN_PASSWORD"
start_backend
