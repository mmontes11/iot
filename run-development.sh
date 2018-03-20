#!/usr/bin/env bash

git submodule foreach npm install
git submodule foreach npm run build
docker-compose -f docker-compose.yml -f docker-compose.development.yml up --build