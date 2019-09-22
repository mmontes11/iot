#!/bin/sh

set -e
mosquitto_passwd -U /etc/mosquitto/passwd
exec "$@"