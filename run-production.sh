#!/usr/bin/env bash

docker-compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.mongo.yml -f docker-compose.mongo.prod.yml up -d
