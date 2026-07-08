#!/bin/bash
# Production deploy — idempotent, safe to re-run on every push.
#
# Prod mirrors dev (infra/docker-compose.prod.yml) but runs the BUILT source:
# the `build` one-shot service installs deps + compiles both apps, then backend
# runs `medusa start` and web runs the built Nitro server, all behind the same
# nginx entrypoint/port as dev. --force-recreate re-runs the `build` service so
# a fresh checkout is always rebuilt; backend/web wait for it to finish
# (depends_on: service_completed_successfully) before starting.
#
# TLS/domain is intentionally NOT handled here — front this stack (published on
# HTTP_PORT, default 8080) with your existing nginx/reverse proxy for SSL.
#
# Usage (on the host, from the repo root):
#   cp .env.example .env.prod    # fill in DOMAIN, secrets/CORS, HTTP_PORT...
#   ./start.prod.sh
set -euo pipefail

# stop all running containers and remove any orphaned ones, then clear volumes/networks in dev environment
docker compose -f infra/docker-compose.yml down --remove-orphans || true

./clear.sh

# cd "$(dirname "$0")/../.."

if [ ! -f .env.prod ]; then
  echo "Missing .env.prod — run: cp .env.example .env.prod, fill it in, then retry." >&2
  exit 1
fi

# get REBUILD_ALL from .env.prod (default false) so you can force a full rebuild/clean of the prod stack
set -a
. .env.prod
set +a
REBUILD_ALL=${REBUILD_ALL:-false}

COMPOSE=(docker compose -f infra/docker-compose.prod.yml --env-file .env.prod)

"${COMPOSE[@]}" down --remove-orphans || true
echo "==> Cleared running containers and orphaned ones."
echo "REBUILD_ALL: $REBUILD_ALL"
if [ "$REBUILD_ALL" = "true" ]; then
  echo "==> REBUILD_ALL: wiping ALL volumes (Postgres data included!)..."
  # `down -v` removes this project's named volumes directly. (The previous
  # `docker volume rm $(docker compose volumes -q)` needed Compose v2.33+ —
  # on older engines it silently removed nothing.) No `build` step: every
  # prod service runs a stock image (node:20/nginx/postgres), nothing to build.
  "${COMPOSE[@]}" down -v --remove-orphans || true
  echo "==> Volumes wiped — the database will be re-seeded from scratch."
fi

echo "==> Building and starting the production stack..."
# Detached on purpose: the provisioning below MUST run right after the stack
# is up. (An attached `up` would block here until Ctrl+C, whose non-zero exit
# — under `set -euo pipefail` — kills the script before provisioning runs.)
# Logs are tailed at the end instead, unless DETACH=1 (deploy.sh over SSH).
"${COMPOSE[@]}" up -d --force-recreate

echo "==> Waiting for backend to become healthy..."
status=""
for i in $(seq 1 45); do
  status="$("${COMPOSE[@]}" ps --format '{{.Health}}' backend 2>/dev/null || true)"
  [ "$status" = "healthy" ] && break
  sleep 2
done
if [ "$status" != "healthy" ]; then
  echo "WARN: backend not reporting healthy yet — provisioning below waits on /health itself." >&2
fi

# Provisioning (idempotent) — see provisioning.sh for details. It runs inside the
# backend container so the host needs no Node. If .env.prod changed, recreate web
# (--no-deps: skip re-running the heavy one-shot build) to pick the values up.
bash ./provisioning.sh

"${COMPOSE[@]}" ps
echo "==> Done. Stack is live on port ${HTTP_PORT:-8080}."
echo "    First deploy only: ./create-admin.sh --prod to (re)create the Medusa admin user."

# if [ "${DETACH:-0}" != "1" ]; then
#   echo "==> Tailing logs (Ctrl+C stops the log view only — containers keep running)."
#   exec "${COMPOSE[@]}" logs -f --tail=100
# fi
