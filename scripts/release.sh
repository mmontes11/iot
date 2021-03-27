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

for p in $(ls -d packages/*); do
  name=$(basename "$p")
  path="$ms"
  dockerfile="$path/Dockerfile"
  if [ ! -f $dockerfile ]; then
    echo "⚠️    ${dockerfile} does not exist. Ignoring '$name'."
    continue
  fi
  package_json="$path/package.json"
  version=$(jq -r .version "$package_json")
  image="$DOCKER_USERNAME/$project-$name:$version"
  build "$image" "$path"
done

build "iot-nginx" "./services/nginx"
