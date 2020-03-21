# IoT
[![Build Status](https://travis-ci.org/mmontes11/iot.svg?branch=develop)](https://travis-ci.org/mmontes11/iot)
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

## Configuration

Create a `.env` like [this one](./.env.example).

## Development

#### MacOS
```bash
$ ./scripts/run-dev.sh
```

#### Other OS
```bash
$ docker-compose -f docker-compose.dev.services.yml up -d --build --force-recreate
$ npm run start:back
$ npm run start:front
$ npm run start:biot
$ npm run start:worker
$ npm run start:thing
```

## Test

```bash
$ ./scripts/run-test.sh
```

## Production

```bash
$ ./scripts/run-pro.sh
```

#### Lite deployment
```bash
$ ./scripts/run-pro-lite.sh
```

## Things

Once everything is up and running, it is time to start deploying things:
- [IoT raspi sensors](https://github.com/mmontes11/iot-raspi-sensors)
- [IoT raspi door](https://github.com/mmontes11/iot-raspi-door)

Alternatively, you can start a mock thing:

```bash
$ npm run start:thing
```
