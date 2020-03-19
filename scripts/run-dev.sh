#!/usr/bin/env bash

# Requirements
# ttab: https://github.com/mklement0/ttab

docker-compose -f docker-compose.dev.services.yml up -d --build --force-recreate
echo "Starting... 🚀"
ttab -t "back" "cd packages/back; nvm use; npm start"
ttab -t "front" "cd packages/front; nvm use; npm start"
ttab -t "biot" "cd packages/biot; nvm use; npm start"
ttab -t "worker" "cd packages/worker; nvm use; npm start"
ttab -t "thing" "cd packages/thing; nvm use; npm start"
