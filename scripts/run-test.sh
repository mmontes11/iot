#!/usr/bin/env bash

cd packages/back
npm install
npm run build
cd -
docker-compose -f docker-compose.test.yml up -d --build
docker ps -a
npm test