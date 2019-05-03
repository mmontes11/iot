# iot
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmontes11/iot)

Generic purpose Internet of Things platform. It consists of the following parts:

* [iot-server](https://github.com/mmontes11/iot-server)
* [iot-worker](https://github.com/mmontes11/iot-worker)
* [biot](https://github.com/mmontes11/biot)
* [iot-client](https://github.com/mmontes11/iot-client)
* [iot-raspi-sensors](https://github.com/mmontes11/iot-raspi-sensors)
* [iot-raspi-door](https://github.com/mmontes11/iot-raspi-door)
* [iot-web](https://github.com/mmontes11/iot-web)

### Configuration

* [nginx](https://github.com/mmontes11/iot/blob/develop/nginx)
* [mosquitto](https://github.com/mmontes11/iot/blob/develop/mosquitto)
* `.env` for [docker-compose](https://github.com/mmontes11/iot/blob/develop/docker-compose.prod.yml)
* `.env` for [iot-server](https://github.com/mmontes11/iot-server/blob/develop/src/config/production.js)
* `.env` for [iot-worker](https://github.com/mmontes11/iot-worker/blob/develop/src/config/production.js)
* `.env` for [iot-web](https://github.com/mmontes11/iot-web/blob/develop/webpack.config.js)
* `.env` for [biot](https://github.com/mmontes11/biot/blob/develop/src/config/production.js)

### Development

```bash
$ ./run-development.sh 
```

### Production

```bash
$ ./run-production.sh 
```

### Things

Once backend is up and running, you can start deploying things:

* [iot-raspi-sensors](https://github.com/mmontes11/iot-raspi-sensors)
* [iot-raspi-door](https://github.com/mmontes11/iot-raspi-door)
