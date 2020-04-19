#!/usr/bin/env bash

deploy() {
    echo "🚀   Deploying $1 ..."
    kubectl apply -f $2
}

deploy "common" "manifests"

for package in $(npx lerna list); do
    manifests="packages/$package/manifests"
    if [ ! -d $manifests ]; then
        echo "⚠️    ${manifests} does not exist. Ignoring $package."
        continue
    fi
    deploy "$package" "$manifests"
done

kubectl get ns,svc,deploy,po,cm,secrets,pvc -o wide -n=iot
