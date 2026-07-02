#!/bin/bash
# Creates the default Medusa admin user, or shows the REAL error if it fails.
#
# Why this script exists: the `backend` service's boot command wraps user
# creation in `|| true` (so a fresh admin-account failure never blocks
# db:migrate / the dev server from starting), which means the real error is
# easy to miss in `docker compose logs backend`. This runs the same command
# directly against the running backend container, unmasked.
#
# Usage (from the repo root, INSIDE WSL where Docker lives):
#   ./infra/scripts/create-admin.sh
#   ./infra/scripts/create-admin.sh other@email.com someOtherPassword
set -euo pipefail

cd "$(dirname "$0")/../.."

# Load ADMIN_EMAIL / ADMIN_PASSWORD (and everything else) from the repo-root
# .env, same file docker compose itself reads via --env-file.
set -a
[ -f .env ] && source .env
set +a

EMAIL="${1:-${ADMIN_EMAIL:-admin@medusa.local}}"
PASSWORD="${2:-${ADMIN_PASSWORD:-supersecret123}}"

COMPOSE=(docker compose -f infra/docker-compose.yml --env-file .env)

echo "Ensuring postgres + backend are up..."
"${COMPOSE[@]}" up -d postgres backend

echo "Waiting for backend to become healthy..."
for i in $(seq 1 30); do
  status="$("${COMPOSE[@]}" ps --format '{{.Health}}' backend 2>/dev/null || true)"
  [ "$status" = "healthy" ] && break
  sleep 2
done

echo "Creating admin user: $EMAIL"
"${COMPOSE[@]}" exec backend npx medusa user -e "$EMAIL" -p "$PASSWORD"

echo "Done. Login at http://localhost:${HTTP_PORT:-8080}/app (or http://localhost:9000/app directly) with:"
echo "  $EMAIL / $PASSWORD"
