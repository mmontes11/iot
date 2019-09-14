# iot-worker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ES6 NodeJS worker that subscribes to MQTT topics from [IoT server](https://github.com/mmontes11/iot-server) to send notifications to [BIoT](https://github.com/mmontes11/biot)

### Development

```bash
$ npm start
```

### Lint

```bash
$ npm run lint
```

### Test and Coverage

```bash
$ npm test
```

### Build Image

```bash
$ npm run build
$ docker build -t iot-worker .
```

### DockerHub

Image available on [Docker Hub](https://hub.docker.com/r/mmontes11/iot-worker)

### Production

See [docker-compose](https://docs.docker.com/compose/) set up on [iot](https://github.com/mmontes11/iot)
