export default {
  validAuthHeader: "Basic YWRtaW46YWRtaW4=",
  invalidAuthHeader: "Whatever",
  validUser: {
    username: "testUser",
    password: "aA12345678&",
  },
  invalidUser: {
    password: "aA12345678&",
  },
  userWithWeakPassword: {
    username: "testUser",
    password: "1234",
  },
  invalidMeasurementRequest: {
    measurement: {
      device: "raspberry",
      value: 10,
    },
    device: {
      name: "raspberry",
      location: {
        longitude: -8.4,
        latitude: 43.37,
      },
    },
  },
};
