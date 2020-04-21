#!/usr/bin/env bash

deploy() {
    echo "🚀   Deploying $1 ..."
    kubectl apply -f $2
}

for package in $(npx lerna list); do
    manifests="packages/$package/manifests"
    if [ ! -d $manifests ]; then
        echo "⚠️    ${manifests} does not exist. Ignoring $package."
        continue
    fi
    deploy "$package" "$manifests"
done

deploy "common" "manifests"

kubectl get ns,svc,deploy,po,cm,secrets,pvc -o wide -n=iot
