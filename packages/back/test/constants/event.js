export default {
  eventRequestWithInvalidEvent: {
    event: {},
    thing: {
      name: "raspberry",
      geometry: {
        type: "Point",
        coordinates: [-8.4065665, 43.3682188],
      },
      topic: "home/room/raspberry/door",
      supportedObservationTypes: {
        measurement: [],
        event: ["door_opened"],
      },
    },
  },
  eventRequestWithInvalidThing: {
    event: {
      type: "door_opened",
    },
    thing: {
      name: "raspberry",
    },
  },
  eventRequestWithThingWithInvalidGeometry: {
    event: {
      type: "door_opened",
    },
    thing: {
      name: "raspberry",
      geometry: {
        coordinates: [-8.4065665, 43.3682188],
      },
      topic: "home/room/raspberry/door",
      supportedObservationTypes: {
        measurement: [],
        event: ["door_opened"],
      },
    },
  },
  validEventRequest: {
    event: {
      thing: "raspberry",
      type: "door_opened",
    },
    thing: {
      name: "raspberry",
      geometry: {
        type: "Point",
        coordinates: [-8.4065665, 43.3682188],
      },
      topic: "home/room/raspberry/door",
      supportedObservationTypes: {
        measurement: [],
        event: ["door_opened"],
      },
    },
  },
  validEventRequestWithValue: {
    event: {
      thing: "raspberry",
      type: "luminosity-changed",
      value: true,
    },
    thing: {
      name: "raspberry",
      geometry: {
        type: "Point",
        coordinates: [-8.4065665, 43.3682188],
      },
      topic: "home/room/raspberry/door",
      supportedObservationTypes: {
        measurement: [],
        event: ["door_opened"],
      },
    },
  },
  doorOpenedEvent: {
    username: "mmontes",
    thing: "raspberry",
    type: "door_opened",
    phenomenonTime: new Date(),
  },
  doorClosedEvent: {
    username: "mmontes",
    thing: "raspberry",
    type: "door_closed",
    phenomenonTime: new Date(),
  },
  doorClosedEvent2: {
    username: "mmontes",
    thing: "arduino",
    type: "door_closed",
    phenomenonTime: new Date(),
  },
  windowOpenedEvent: {
    username: "mmontes",
    thing: "raspberry",
    type: "window_opened",
    phenomenonTime: new Date(),
  },
};
