#!/bin/bash
set -e

# --env-file loads `.env` from the repo root (see .env.example) without
# touching how the compose file's own relative paths (../:/workspace,
# ./nginx/...) resolve — those stay relative to infra/, where the file lives.
# (Do NOT use --project-directory here: it would also rebase those paths onto
# the repo root, turning "../" into the repo's *parent* directory.)
COMPOSE="docker compose -f infra/docker-compose.yml --env-file .env"

$COMPOSE down
# # docker remove all images
# $COMPOSE down --rmi all
# # remove all volumes
# $COMPOSE down -v

# Source code inside the containers already hot-reloads (dev servers with
# polling — see docker-compose.yml). docker-compose.yml itself and
# medusa-config.ts don't: only `docker compose up -d` re-reads the former,
# and the backend process only reads the latter once at startup. This
# background watcher applies those two automatically; killed via the trap
# below whenever `$COMPOSE up` exits (Ctrl+C included).
./scripts/watch-config.sh &
WATCH_PID=$!
trap 'kill "$WATCH_PID" 2>/dev/null' EXIT

$COMPOSE up
# $COMPOSE --profile storefront up -d

# export COMPOSE_PROFILES=storefront
# $COMPOSE up
