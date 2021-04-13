# IoT
[![Lint](https://github.com/mmontes11/iot/workflows/Lint/badge.svg)](https://github.com/mmontes11/iot/actions?query=workflow%3ALint)
[![Build](https://github.com/mmontes11/iot/workflows/Build/badge.svg)](https://github.com/mmontes11/iot/actions?query=workflow%3ABuild)
[![Test](https://github.com/mmontes11/iot/workflows/Test/badge.svg)](https://github.com/mmontes11/iot/actions?query=workflow%3ATest)
[![Release](https://github.com/mmontes11/iot/workflows/Release/badge.svg)](https://github.com/mmontes11/iot/actions?query=workflow%3ARelease)
[![Deploy](https://github.com/mmontes11/iot/workflows/Deploy/badge.svg)](https://github.com/mmontes11/iot/actions?query=workflow%3ADeploy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmontes11/iot)

General purpose Internet of Things platform.

### Demo
###### Front

https://iot.mmontes-dev.duckdns.org/
<details>
  <summary>Credentials</summary>
  <p>
  
  Username: `demo`
  
  Password: `demoIoT$`
  
  </p>
</details>

###### BIoT

[@mmontesIoTBot](https://t.me/mmontesIoTBot)

### Installation

###### Local + Tmux

- Install [tmux](https://github.com/tmux/tmux)
- Configure `.env` files:
  - [common](./.env.example)
  - [back](./packages/back/.env.example)
  - [biot](./packages/biot/.env.example)
  - [front](./packages/front/.env.example)
  - [thing](./packages/thing/.env.example)
  - [worker](./packages/worker/.env.example)
  
```bash
$ ./scripts/run-dev.sh
```

###### Kubernetes + Helm

Configure [`iot-secret.yml`](./charts/iot/iot-secret.yml.example) and then:

```bash
$ helm install iot charts/iot
```

### Things

Once everything is up and running, it is time to start deploying things:
- [IoT raspi sensors](https://github.com/mmontes11/iot-raspi-sensors)
- [IoT raspi door](https://github.com/mmontes11/iot-raspi-door)

Alternatively, you can start a mock thing:

```bash
$ npm run start:thing
```
