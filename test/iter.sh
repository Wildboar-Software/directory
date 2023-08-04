#!/bin/sh

# docker compose -f ./test/docker-compose.yaml down -v
docker compose -f ./test/docker-compose.yaml down
nx run meerkat:build
docker compose -f ./test/docker-compose.yaml up --build -d
sleep 60
node ./dist/apps/create-test-dit/main.js --profile=root --accessPoint=idm://localhost:14632
node ./dist/apps/create-test-dit/main.js --profile=ru --accessPoint=idm://localhost:34632
node ./dist/apps/create-test-dit/main.js --profile=moscow --accessPoint=idm://localhost:24632
docker compose -f ./test/docker-compose.yaml logs --follow
