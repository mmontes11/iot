#!/usr/bin/env bash

git submodule foreach npm install
git submodule foreach npm run build
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.mongo.yml up --build