#!/usr/bin/env bash

docker-compose -f docker-compose.yml -f docker-compose.production.yml -f docker-compose.mongo.yml -f docker-compose.mongo.production.yml up -d
