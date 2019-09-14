#!/usr/bin/env bash

docker run --name iot-web --restart always -p 80:80 -d iot-web
