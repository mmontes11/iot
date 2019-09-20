const dotenv = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env.dev") });
}
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env.test") });
}

module.exports = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  FRONT_API_URL: JSON.stringify(process.env.FRONT_API_URL),
  FRONT_SOCKET_URL: JSON.stringify(process.env.FRONT_SOCKET_URL),
  BACK_BASIC_AUTH_USER: JSON.stringify(process.env.BACK_BASIC_AUTH_USER),
  BACK_BASIC_AUTH_PASSWORD: JSON.stringify(process.env.BACK_BASIC_AUTH_PASSWORD),
  GOOGLE_MAPS_KEY: JSON.stringify(process.env.GOOGLE_MAPS_KEY),
};
