#!/usr/bin/env bash

npm i mosca -g
mosca &

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org=4.0.8 mongodb-org-server=4.0.8 mongodb-org-shell=4.0.8 mongodb-org-mongos=4.0.8 mongodb-org-tools=4.0.8
sleep 15
sudo mkdir -p /data/db
sudo mongod &
