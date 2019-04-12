#!/bin/sh

set -e

PASSWDDIR=/etc/mosquitto
PASSWDFILE=$PASSWDDIR/passwd
mkdir -p $PASSWDDIR
touch $PASSWDFILE
mosquitto_passwd -b $PASSWDFILE mosquitto mosquitto

exec "$@"
