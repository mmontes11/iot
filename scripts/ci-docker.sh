#!/usr/bin/env bash

printenv > .env	
docker-compose up -d --build
docker ps -a