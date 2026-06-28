#!/usr/bin/env bash

#  cd to current script directory
cd "$(dirname "$0")"

docker compose down
docker compose -f docker-compose.yml up -d --build
