#!/usr/bin/env bash

printenv > .env	
docker-compose up -d
docker ps -a