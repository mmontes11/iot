export default {
  validThing: {
    name: "raspberry",
    geometry: {
      type: "Point",
      coordinates: [-8.4065665, 43.3682188],
    },
    topic: "home/room/raspberry",
    supportedObservationTypes: {
      measurement: ["temperature"],
      event: [],
    },
  },
  invalidThing: {
    name: "raspberry",
  },
  thingWithInvalidGeometry: {
    name: "raspberry",
    geometry: {
      coordinates: [-8.4065665, 43.3682188],
    },
    topic: "home/room/raspberry",
    supportedObservationTypes: {
      measurement: ["temperature"],
      event: [],
    },
  },
  validMeasurementWithKind: {
    kind: "measurement",
    thing: "raspberry",
    type: "temperature",
    unit: {
      name: "degrees",
      symbol: "°C",
    },
    value: 10,
  },
  invalidMeasurementWithKind: {
    kind: "measurement",
    thing: "raspberry",
    type: "temperature",
    unit: {
      name: "degrees",
      symbol: "°C",
    },
  },
  validMeasurementWithInvalidKind: {
    kind: "foo",
    thing: "raspberry",
    type: "temperature",
    unit: {
      name: "degrees",
      symbol: "°C",
    },
    value: 10,
  },
  validEventWithKind: {
    kind: "event",
    username: "mmontes",
    thing: "raspberry",
    type: "window_opened",
    duration: {
      unit: {
        name: "seconds",
        symbol: "s",
      },
      value: 2.4,
    },
  },
  invalidEventWithKind: {
    kind: "event",
    username: "mmontes",
    thing: "raspberry",
    duration: {
      unit: {
        name: "seconds",
        symbol: "s",
      },
      value: 2.4,
    },
  },
  validEventWithInvalidKind: {
    kind: "bar",
    username: "mmontes",
    thing: "raspberry",
    type: "window_opened",
    duration: {
      unit: {
        name: "seconds",
        symbol: "s",
      },
      value: 2.4,
    },
  },
};
