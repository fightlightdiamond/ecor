#!/usr/bin/env bash

# run and test containers migration in apps/api directory 

# stop all containers and remove them
docker compose down
# stop all containers in the apps/api directory and remove them
docker compose -f apps/api/docker-compose.yml down
# build and start all containers

docker compose -f apps/api/docker-compose.yml up -d 

pnpm run dev:api
