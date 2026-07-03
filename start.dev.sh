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

$COMPOSE up
# $COMPOSE --profile storefront up -d

# export COMPOSE_PROFILES=storefront
# $COMPOSE up
