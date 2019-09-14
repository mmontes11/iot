# iot-client

[![Build Status](https://travis-ci.org/mmontes11/iot-client.svg?branch=develop)](https://travis-ci.org/mmontes11/iot-client)
[![Coverage Status](https://coveralls.io/repos/github/mmontes11/iot-client/badge.svg?branch=develop)](https://coveralls.io/github/mmontes11/iot-client?branch=develop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/@mmontes11/iot-client.png)](https://nodei.co/npm/@mmontes11/iot-client)

ES6 client library for consuming [IoT server](https://github.com/mmontes11/iot-server) REST API

### Lint

```bash
$ npm run lint
```

### Test and Coverage

```bash
$ npm test
```

### Installing

```bash
$ npm i --save @mmontes11/iot-client
```

### Usage

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
