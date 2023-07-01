#!/bin/sh

# docker compose -f ./test/docker-compose.yaml down -v
docker compose -f ./test/docker-compose.yaml down
nx run meerkat:build
docker compose -f ./test/docker-compose.yaml up --build
