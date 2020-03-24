#!/usr/bin/env bash

docker-compose -f docker-compose.yml -f docker-compose.pro.lite.yml -f docker-compose.services.yml rm --stop --force
