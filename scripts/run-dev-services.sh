#!/usr/bin/env bash

docker-compose -f docker-compose.dev.services.yml up -d --build --force-recreate
