## @mmontes11/iot-client

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Cross platform client for [IoT](https://github.com/mmontes11/iot).

## Installation

[![NPM](https://nodei.co/npm/@mmontes11/iot-client.png)](https://nodei.co/npm/@mmontes11/iot-client)

```bash
$ npm i --save @mmontes11/iot-client
```

## Usage

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
    observations,
    thing,
  });
  console.log(res);
} catch (err) {
  console.log(err);
}
```