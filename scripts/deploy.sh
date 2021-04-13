#!/usr/bin/env bash

RELEASE="iot"
REPO="mmontes"

helm repo add "$REPO" https://charts.mmontes-dev.duckdns.org
helm repo update

echo "🚀 Deploying '${RELEASE}'..."
helm upgrade --install "$RELEASE" "$REPO/$RELEASE"
