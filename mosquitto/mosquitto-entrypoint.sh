#!/bin/sh

set -e

PASSWDFILE=/etc/mosquitto/passwd
touch $PASSWDFILE
mosquitto_passwd -b $PASSWDFILE mosquitto mosquitto

exec "$@"
