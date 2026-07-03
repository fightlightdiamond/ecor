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
#   cp .env.example .env    # fill in secrets/CORS, HTTP_PORT, etc.
#   ./infra/scripts/deploy.sh
set -euo pipefail

# cd "$(dirname "$0")/../.."

docker compose down --remove-orphans || true
# docker compose rm -f || true
# docker volume prune -f || true
# docker network prune -f || true

if [ ! -f .env.prod ]; then
  echo "Missing .env.prod — run: cp .env.example .env.prod, fill it in, then retry." >&2
  exit 1
fi

COMPOSE=(docker compose -f infra/docker-compose.prod.yml --env-file .env.prod)

echo "==> Building and starting the production stack..."
# --force-recreate re-runs the one-shot `build` service against the current
# source; migrations run in the backend service's own start command.
"${COMPOSE[@]}" up -d --force-recreate

echo "==> Waiting for backend to become healthy..."
for i in $(seq 1 45); do
  status="$("${COMPOSE[@]}" ps --format '{{.Health}}' backend 2>/dev/null || true)"
  [ "$status" = "healthy" ] && break
  sleep 2
done

"${COMPOSE[@]}" ps
echo "==> Done. Stack is live on port ${HTTP_PORT:-8080}."
echo "    First deploy only: ./infra/scripts/create-admin.sh --prod to (re)create the Medusa admin user."
