#!/bin/sh

# docker compose -f ./test/docker-compose.yaml down -v
docker compose -f ./test/docker-compose.yaml down
nx run meerkat:build
docker compose -f ./test/docker-compose.yaml up --build

# node ./dist/apps/x500-cli/main.js dop supply shadow 'c=US' 'cn=dsa2' --naddr=idm://dsa2:4632 --supplier-initiated --all-contexts --supply-all-contexts --other-times --window-size=120 --update-interval=300
