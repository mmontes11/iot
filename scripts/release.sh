#!/usr/bin/env bash

npx lerna bootstrap
npm run build

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

project=$(jq -r .name package.json)
version=$(jq -r .version package.json)
platform="linux/amd64,linux/arm64,linux/arm"

echo "👷   Creating builder $project ..."
docker buildx create --name "$project"
docker buildx use "$project"

build() {
    echo "🏗    Building $1 ..."
    docker buildx build --platform "$platform" -t "$1" --push "$2"
    docker buildx imagetools inspect "$1"
}

for package in $(npx lerna list); do
    package_path="packages/$package"
    dockerfile="$package_path/Dockerfile"
    if [ ! -f $dockerfile ]; then
        echo "⚠️    ${dockerfile} does not exist. Ignoring $package."
        continue
    fi
    package_json="$package_path/package.json"
    version=$(jq -r .version "$package_json")
    image="$DOCKER_USERNAME/$project-$package:$version"
    build "$image" "$package_path"
done
