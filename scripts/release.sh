#!/usr/bin/env bash

npx lerna bootstrap
npm run build

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

project=$(jq -r .name package.json)
tag=$(git describe --abbrev=0 --tags)
platform="linux/amd64,linux/arm64,linux/arm"

function release() {
    name="$1"
    path="$2"
    image="$DOCKER_USERNAME/$project-$name"
    platform="linux/amd64,linux/arm64,linux/arm"

    echo "🏗    Building '$image'. Context: '$path'"
    docker buildx create --name "$name" --use --append
    docker buildx build --platform "$platform" -t "$image:$tag" -t "$image:latest" --push .
    docker buildx imagetools inspect "$image:latest"
}

for p in $(ls -d packages/*); do
    name=$(basename "$p")
    if [ $name == "client" ]; then
      continue;
    fi
    release "$name" "$p"
done

release "nginx" "./services/nginx"
