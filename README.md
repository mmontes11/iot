# IoT
[![CI](https://github.com/mmontes11/iot/actions/workflows/ci.yml/badge.svg)](https://github.com/mmontes11/iot/actions/workflows/ci.yml)
[![Release](https://github.com/mmontes11/iot/actions/workflows/release.yml/badge.svg)](https://github.com/mmontes11/iot/actions/workflows/release.yml)
[![Artifact HUB](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/iot)](https://artifacthub.io/packages/helm/mmontes/iot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmontes11/iot)

General purpose Internet of Things platform.

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

```bash
helm repo add mmontes https://mmontes11.github.io/charts
helm install iot mmontes/iot
```

### Things

Once everything is up and running, it is time to start deploying things:
- [IoT raspi sensors](https://github.com/mmontes11/iot-raspi-sensors)
- [IoT raspi door](https://github.com/mmontes11/iot-raspi-door)

Alternatively, you can start a mock thing:

```bash
$ npm run start:thing
```
