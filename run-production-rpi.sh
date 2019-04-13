#!/usr/bin/env bash

. build-web.sh
docker-compose -f docker-compose.yml -f docker-compose.production.rpi.yml up -d