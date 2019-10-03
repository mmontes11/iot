let IoTClient;

if (process.env.NODE_ENV === "production") {
  IoTClient = require("./dist");
} else {
  IoTClient = require("./src");
}

module.exports = {
  IoTClient,
};
