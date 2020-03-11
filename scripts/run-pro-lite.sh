#!/usr/bin/env bash

npm run build
docker-compose -f docker-compose.yml -f docker-compose.pro.lite.yml -f docker-compose.services.yml up -d --build
