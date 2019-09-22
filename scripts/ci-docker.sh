#!/usr/bin/env bash

printenv > .env
docker-compose -f docker-compose.test.yml up -d --build
docker ps -a