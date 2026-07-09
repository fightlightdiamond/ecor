#!/bin/bash
# Starts the production stack from PREBUILT output — it never builds anything:
# no medusa/nuxt build, no TypeScript, no source code required on this host.
# (The stack's one-shot `deps` service only installs the prebuilt backend's
# runtime deps and refetches sharp's linux binary — see the compose file.)
#
# Dual-use:
#   - locally : called by start.prod.sh right after build-local.sh built the
#               apps with the local Node.js
#   - server  : shipped there by deploy.sh next to the built artifacts and run
#               over SSH — the server only needs docker + compose v2
#
# Reads .env.prod next to it.
#
# REBUILD_ALL=true in .env.prod wipes ALL prod volumes (Postgres data
# included!) before starting — base commerce data is re-seeded by the backend
# boot command and re-provisioned by provisioning.sh automatically after.
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env.prod ]; then
  echo "Missing .env.prod — run: cp .env.example .env.prod, fill it in, then retry." >&2
  exit 1
fi

set -a
. .env.prod
set +a

COMPOSE=(docker compose -f infra/docker-compose.prod.yml --env-file .env.prod)

"${COMPOSE[@]}" down --remove-orphans || true
echo "==> Cleared running containers and orphaned ones."

if grep -q '^REBUILD_ALL=true' .env.prod; then
  echo "==> REBUILD_ALL: wiping ALL volumes (Postgres data included!)..."
  "${COMPOSE[@]}" down -v --remove-orphans || true
  echo "==> Volumes wiped — the database will be re-seeded from scratch."
fi

echo "==> Starting the production stack (prebuilt output — nothing to build here)..."
"${COMPOSE[@]}" up -d --force-recreate

echo "==> Waiting for backend to become healthy..."
status=""
for _ in $(seq 1 45); do
  status="$("${COMPOSE[@]}" ps --format '{{.Health}}' backend 2>/dev/null || true)"
  [ "$status" = "healthy" ] && break
  echo "    backend health: $status (waiting up to 3 more minutes)..."
  sleep 3
done
if [ "$status" != "healthy" ]; then
  echo "WARN: backend not reporting healthy yet — provisioning below waits on /health itself." >&2
fi
sleep 1m
# Provisioning (idempotent) — runs setup-web-integration.mjs INSIDE the
# backend container (compose mounts this deploy dir at /workspace, so the
# script and .env.prod are visible there), then recreates web so it picks up
# the publishable key/region.
bash ./provisioning.sh

"${COMPOSE[@]}" ps
echo "==> Done. Stack is live on port ${HTTP_PORT:-8800}."
echo "    First deploy only: ./create-admin.sh --prod to (re)create the Medusa admin user."
