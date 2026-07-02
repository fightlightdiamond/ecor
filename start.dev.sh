#!/bin/bash
set -e

# Shared network so infra/docker-compose.yml's nginx can reach `backend` by
# service name even though it's a separate compose project.
docker network create tlcv_shared 2>/dev/null || true

docker compose down
docker compose up -d
# docker compose --profile storefront up -d

# Nuxt web + single-port nginx entrypoint -> http://localhost
docker compose -f infra/docker-compose.yml up -d

# export COMPOSE_PROFILES=storefront
# docker compose up
