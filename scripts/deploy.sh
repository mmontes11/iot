#!/usr/bin/env bash

deploy() {
    echo "🚀   Deploying $1 ..."
    kubectl apply -f $2
}

deploy "namespace" manifests/0_namespace.yml

for package in $(npx lerna list); do
    manifests="packages/$package/manifests"
    if [ ! -d $manifests ]; then
        echo "⚠️    ${manifests} does not exist. Ignoring $package."
        continue
    fi
    deploy "$package" "$manifests"
done

deploy "common" manifests

kubectl get all -o wide -n=iot
