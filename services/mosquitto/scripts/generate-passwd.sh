#!/bin/sh

mkdir -p /etc/mosquitto
echo "$1:$2" > /etc/mosquitto/passwd