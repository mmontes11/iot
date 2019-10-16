if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist");
} else {
  module.exports = require("./src");
}