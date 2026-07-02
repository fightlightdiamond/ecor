#!/bin/bash

docker compose down
export COMPOSE_PROFILES=storefront
docker compose up -d
