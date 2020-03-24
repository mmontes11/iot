#!/usr/bin/env bash

docker-compose -f docker-compose.yml -f docker-compose.pro.yml -f docker-compose.services.yml -f docker-compose.mongo.yml rm --stop --force
