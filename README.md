# IoT
[![Build Status](https://travis-ci.org/mmontes11/iot.svg?branch=develop)](https://travis-ci.org/mmontes11/iot)
[![Coverage Status](https://coveralls.io/repos/github/mmontes11/iot/badge.svg?branch=develop)](https://coveralls.io/github/mmontes11/iot?branch=develop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmontes11/iot)

General purpose Internet of Things platform.

## Demo

### Front

https://iot.mmontes-dev.duckdns.org/
<details>
  <summary>Credentials</summary>
  <p>
  
  Username: `demo`
  
  Password: `demoIoT$`
  
  </p>
</details>

### BIoT

[@mmontesIoTBot](https://t.me/mmontesIoTBot)

## Development

Configure `.env` files:
- [common](./.env.example)
- [back](./packages/back/.env.example)
- [biot](./packages/biot/.env.example)
- [front](./packages/front/.env.example)
- [thing](./packages/thing/.env.example)
- [worker](./packages/worker/.env.example)

#### MacOS
```bash
$ ./scripts/start-dev.sh
```

#### Other OS
```bash
$ docker-compose up -d --build --force-recreate
$ npm run start:back
$ npm run start:front
$ npm run start:biot
$ npm run start:worker
$ npm run start:thing
```

## Deployment

Configure `secret.yml` files:
- [back](./packages/back/manifests/secret.yml.example)
- [biot](./packages/biot/manifests/secret.yml.example)
- [worker](./packages/worker/manifests/secret.yml.example)

```bash
$ ./scripts/build.sh
$ ./scripts/deploy.sh
```

## Things

Once everything is up and running, it is time to start deploying things:
- [IoT raspi sensors](https://github.com/mmontes11/iot-raspi-sensors)
- [IoT raspi door](https://github.com/mmontes11/iot-raspi-door)

Alternatively, you can start a mock thing:

```bash
$ npm run start:thing
```
