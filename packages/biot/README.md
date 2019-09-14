# biot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Telegram IoT bot that notifies you about anything that happens in your things. 
It consumes [IoT backend](https://github.com/mmontes11/iot-backend) REST API via [IoT client](https://github.com/mmontes11/iot_client) and provides its own REST API to receive notifications.

### Development

```bash
$ npm start
```

### Lint

```bash
$ npm run lint
```

### Build Image

```bash
$ npm run build
$ docker build -t biot .
```
### DockerHub

Image available on [Docker Hub](https://hub.docker.com/r/mmontes11/biot/)

### Production

See [docker-compose](https://docs.docker.com/compose/) set up on [iot](https://github.com/mmontes11/iot)

### Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9ac0c99ff1cd0cb35393#?env%5Bbiot%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5Ijoic2VydmVyIiwidmFsdWUiOiJsb2NhbGhvc3Q6OTA5MCIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJiYXNpY0F1dGgiLCJ2YWx1ZSI6IllXUnRhVzQ2WVdSdGFXND0iLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoidXNlcm5hbWUiLCJ2YWx1ZSI6ImFkbWluIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InBhc3N3b3JkIiwidmFsdWUiOiJhQTEyMzQ1Njc4JiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ0b2tlbiIsInZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5Ym1GdFpTSTZJbUZrYldsdUlpd2lhV0YwSWpveE5URTVOamN3T0RRemZRLm9MdlgzckI0SVBkRDRHcWE0aDU3UTVNSW9qWjFzc1VaMF9DUkZPQzUwUHMiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoiY2hhdElkIiwidmFsdWUiOiI1NjU1OTgiLCJ0eXBlIjoidGV4dCJ9XQ==)
