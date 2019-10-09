#!/usr/bin/env bash

npm run build
docker-compose -f docker-compose.yml -f docker-compose.pro.yml -f docker-compose.services.yml -f docker-compose.mongo.yml up -d --build