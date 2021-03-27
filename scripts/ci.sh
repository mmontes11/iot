#!/usr/bin/env bash

echo $ENV_TEST > .env	
cp .env packages/back
for p in $(ls -d packages/*); do
  cp .env "$p"
done

docker-compose up -d
docker ps -a