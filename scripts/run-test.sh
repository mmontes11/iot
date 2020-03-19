#!/usr/bin/env bash

docker-compose -f docker-compose.test.yml up -d --build --force-recreate
docker ps -a
npm test