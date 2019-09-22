# IoT
[![Build Status](https://travis-ci.org/mmontes11/iot.svg?branch=develop)](https://travis-ci.org/mmontes11/iot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmontes11/iot)

Generic purpose Internet of Things platform.

## Configuration

Create a `.env` like [this one](./.env.example).

## Development

#### MacOS
```bash
$ ./scripts/run-dev.sh
```

#### Other OS
```bash
$ docker-compose -f docker-compose.dev.services.yml up -d --build
$ npm run start:back
$ npm run start:front
$ npm run start:biot
$ npm run start:worker
```

## Test

```bash
$ ./scripts/run-test.sh
```

## Production

#### Raspberry Pi
```bash
$ ./scripts/run-pro-rpi.sh
```

#### Other platform
```bash
$ ./scripts/run-pro.sh
```

## Client

[![NPM](https://nodei.co/npm/@mmontes11/iot-client.png)](https://nodei.co/npm/@mmontes11/iot-client)

```bash
$ npm i --save @mmontes11/iot-client
```

```javascript
import { IoTClient } from "@mmontes11/iot-client";

const iotClient = new IoTClient({
  url: 'http://localhost:8000',
  username: 'foo',
  password: 'bar',
  basicAuthUsername: 'foo',
  basicAuthPassword: 'bar'
});

try {
  const res = await iotClient.observationsService.create({
      observations: observations,
      thing: thing
  });
  console.log(res);
} catch (err) {
  console.log(err);
}
```

## Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/51c5ec6b69c744e25a5a#?env%5Biot-dev%5D=W3sia2V5Ijoic2VydmVyIiwidmFsdWUiOiJsb2NhbGhvc3Q6ODAiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InRva2VuIiwidmFsdWUiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlibUZ0WlNJNkltMXRiMjUwWlhNaUxDSnBZWFFpT2pFMU1EWTNOekV4T0RCOS5KRWw3WjA3QlFsdm5aTzBFZ2tORlFhX0JEa0ZTMl9RelB6SEZsOW8ySUNZIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJiYXNpY0F1dGgiLCJ2YWx1ZSI6IllXUnRhVzQ2WVdSdGFXND0iLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InVzZXJuYW1lIiwidmFsdWUiOiJhZG1pbiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicGFzc3dvcmQiLCJ2YWx1ZSI6ImFBMTIzNDU2NzgmIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJtZWFzdXJlbWVudFR5cGUiLCJ2YWx1ZSI6InRlbXBlcmF0dXJlIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJldmVudFR5cGUiLCJ2YWx1ZSI6ImRvb3Itb3BlbmVkIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0aGluZyIsInZhbHVlIjoicmFzcGkiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6ImNoYXRJZCIsInZhbHVlIjoiNTY1NTk4IiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0b3BpY0lkIiwidmFsdWUiOiI1YWJlMjBhMzc3M2ZmYTZhYTFhMmNlYWQiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InN1YnNjcmlwdGlvbklkIiwidmFsdWUiOiI1YWU0YjVhYzllN2QyMDFiYmUyY2E3MGYiLCJlbmFibGVkIjp0cnVlfV0=)
