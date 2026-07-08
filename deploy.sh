#!/bin/bash
# =============================================================================
# Remote deploy over SSH — no git push involved.
# =============================================================================
# Syncs the working tree straight to the server, then runs ./start.prod.sh
# THERE — the prod compose stack's one-shot `build` service does the actual
# npm install + medusa/nuxt builds on the server, inside docker. Nothing is
# built locally and nothing goes through a git remote.
#
# Works from Git Bash (Windows), Linux, and macOS:
#   - rsync on both ends (Linux/macOS/WSL) -> incremental sync + stale-file delete
#   - no rsync (stock Git Bash)            -> tar-over-ssh full-copy fallback
#
# Prerequisites:
#   local : bash + ssh + (rsync or tar), SSH key auth to the server
#   server: docker + compose v2 installed, user allowed to run docker
#
# Usage (from the repo root):
#   ./deploy.sh [user@server-ip] [remote_dir]     # defaults below
#
# Options (env vars):
#   DEPLOY_SERVER=user@ip   override the default server
#   DEPLOY_DIR=/path        override the default remote directory
#   DEPLOY_SSH_PORT=22      SSH port
#   PUSH_ENV=1              overwrite the server's .env.prod with the local one
#                           (DOMAIN is rewritten to the server IP automatically)
#
# .env.prod handling: the server keeps its OWN copy (its DOMAIN is the server
# IP, and it may hold real secrets). It is only pushed on the FIRST deploy —
# or when you explicitly pass PUSH_ENV=1 — never silently overwritten.
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")"

DEPLOY_SERVER="${DEPLOY_SERVER:-d@192.168.1.22}"
DEPLOY_DIR="${DEPLOY_DIR:-/tmp_DEV/www/htmls/thanglongcheviet}"

SERVER="${1:-$DEPLOY_SERVER}"
REMOTE_DIR="${2:-$DEPLOY_DIR}"
SSH_PORT="${DEPLOY_SSH_PORT:-22}"
PUSH_ENV="${PUSH_ENV:-0}"

if [ -z "$SERVER" ]; then
  echo "Usage: ./deploy.sh <user@server-ip> [remote_dir]" >&2
  echo "Env options: DEPLOY_SERVER, DEPLOY_DIR, DEPLOY_SSH_PORT, PUSH_ENV=1" >&2
  exit 1
fi

HOST_IP="${SERVER##*@}"
SSH=(ssh -p "$SSH_PORT" "$SERVER")

# --- key auth (one-time setup on a fresh machine) ------------------------------
# Every later ssh/scp/rsync would ask for the password without a key, so if
# key auth is not working yet, run setup-ssh.sh: it generates a key if this
# machine has none and installs it on the server (asks the password ONCE).
if ! ssh -p "$SSH_PORT" -o BatchMode=yes -o ConnectTimeout=5 "$SERVER" true 2>/dev/null; then
  echo "==> SSH key auth not working yet — running setup-ssh.sh ..."
  bash ./setup-ssh.sh "$SERVER"
fi

echo "==> Preflight: checking the server..."
"${SSH[@]}" "set -e
  command -v docker >/dev/null || { echo 'ERROR: docker is not installed on the server'; exit 1; }
  docker compose version >/dev/null 2>&1 || { echo 'ERROR: docker compose v2 plugin is missing on the server'; exit 1; }
  mkdir -p '$REMOTE_DIR'"

# --- .env.prod ----------------------------------------------------------------
if [ "$PUSH_ENV" = "1" ] || ! "${SSH[@]}" "[ -f '$REMOTE_DIR/.env.prod' ]"; then
  [ -f .env.prod ] || { echo "ERROR: local .env.prod missing (cp .env.example .env.prod first)." >&2; exit 1; }
  if grep -q '^REBUILD_ALL=true' .env.prod; then
    echo "!!  WARNING: .env.prod has REBUILD_ALL=true — on the server start.prod.sh"
    echo "!!  will wipe ALL prod volumes, INCLUDING the Postgres database."
    echo "!!  (store data + publishable key are re-provisioned automatically after)"
    read -r -p "!!  Continue anyway? [y/N] " ans
    # case (not \${ans,,}): macOS ships bash 3.2 without lowercase expansion.
    case "$ans" in y|Y) ;; *) exit 1 ;; esac
  fi
  echo "==> Pushing .env.prod (DOMAIN will be set to $HOST_IP)..."
  scp -P "$SSH_PORT" -q .env.prod "$SERVER:$REMOTE_DIR/.env.prod"
  "${SSH[@]}" "sed -i 's/^DOMAIN=.*/DOMAIN=$HOST_IP/' '$REMOTE_DIR/.env.prod'"
else
  echo "==> Server already has .env.prod — keeping it (PUSH_ENV=1 to overwrite)."
fi

# --- sync source ----------------------------------------------------------------
# One exclude list for both transports. Excluded paths are SKIPPED, never
# deleted on the server, so server-side build output and env survive deploys.
EXCLUDES=(
  '.git'
  'node_modules'
  '.env' '.env.dev' '.env.prod'
  'apps/web/.nuxt' 'apps/web/.output'
  'apps/backend/.medusa'
  'apps/backend/static'
  'apps/storefront/.next'
  '.pnpm-store'
)

if command -v rsync >/dev/null && "${SSH[@]}" "command -v rsync >/dev/null"; then
  echo "==> Syncing source with rsync to $SERVER:$REMOTE_DIR ..."
  RSYNC_EX=()
  for e in "${EXCLUDES[@]}"; do RSYNC_EX+=(--exclude "$e"); done
  # --stats (not --info=stats1): macOS ships rsync 2.6.9 which lacks --info.
  rsync -az --delete --stats -e "ssh -p $SSH_PORT" "${RSYNC_EX[@]}" \
    ./ "$SERVER:$REMOTE_DIR/"
else
  echo "==> rsync not available on both ends — falling back to tar over ssh (full copy)."
  # Without rsync --delete, files deleted/renamed locally would linger on the
  # server, so wipe the pure-source trees first. Deliberately NOT touched:
  # .env.prod (root), apps/web/.output (a fresh build recreates it), and
  # everything in docker volumes (Postgres data, backend .medusa, prod uploads).
  "${SSH[@]}" "cd '$REMOTE_DIR' &&
    rm -rf apps/backend/src apps/backend/*.json apps/backend/*.ts \
           apps/web/assets apps/web/components apps/web/composables apps/web/layouts \
           apps/web/pages apps/web/plugins apps/web/public apps/web/server apps/web/utils \
           apps/web/*.ts apps/web/*.json apps/web/*.md \
           apps/storefront infra scripts docs demo \
           *.sh *.json *.md *.ts LICENSE 2>/dev/null || true"
  # Pair each pattern with ./-anchored and */-prefixed variants so both GNU tar
  # (Git Bash/Linux) and bsdtar (macOS) match nested paths the same way.
  TAR_EX=()
  for e in "${EXCLUDES[@]}"; do
    TAR_EX+=(--exclude "$e" --exclude "./$e" --exclude "*/$e")
  done
  tar czf - "${TAR_EX[@]}" . | "${SSH[@]}" "tar xzf - -C '$REMOTE_DIR'"
  echo "    Transfer done."
fi

# --- deploy ---------------------------------------------------------------------
echo "==> Running start.prod.sh on the server (docker build + up — takes a while)..."
"${SSH[@]}" "cd '$REMOTE_DIR' &&
  sed -i 's/\r\$//' *.sh scripts/*.sh 2>/dev/null || true
  chmod +x *.sh scripts/*.sh 2>/dev/null || true
  DETACH=1 bash ./start.prod.sh"

# --- verify from this machine ------------------------------------------------------
HTTP_PORT="$("${SSH[@]}" "grep '^HTTP_PORT=' '$REMOTE_DIR/.env.prod' | cut -d= -f2" )"
HTTP_PORT="${HTTP_PORT:-8080}"
echo "==> Verifying http://$HOST_IP:$HTTP_PORT/health ..."
for _ in $(seq 1 10); do
  if curl -fsS -m 5 "http://$HOST_IP:$HTTP_PORT/health" >/dev/null 2>&1; then
    echo "==> DEPLOY OK"
    echo "    Web:   http://$HOST_IP:$HTTP_PORT/"
    echo "    Admin: http://$HOST_IP:$HTTP_PORT/app"
    echo ""
    echo "First deploy only:"
    echo "  1) Admin user:      ssh -p $SSH_PORT $SERVER 'cd $REMOTE_DIR && bash ./create-admin.sh --prod'"
    echo "  2) VN region/prices (run from LOCAL, then push the updated env):"
    echo "       ENV_FILE=.env.prod MEDUSA_BACKEND_URL=http://$HOST_IP:$HTTP_PORT node scripts/setup-web-integration.mjs"
    echo "       PUSH_ENV=1 ./deploy.sh $SERVER $REMOTE_DIR"
    exit 0
  fi
  sleep 3
done

echo "WARNING: /health not reachable from here (server firewall may block port $HTTP_PORT)." >&2
echo "Check on the server:" >&2
echo "  ssh -p $SSH_PORT $SERVER 'cd $REMOTE_DIR && docker compose -f infra/docker-compose.prod.yml --env-file .env.prod ps'" >&2
exit 1
