require("common/config");

module.exports = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  FRONT_API_URL: JSON.stringify(process.env.FRONT_API_URL),
  GOOGLE_MAPS_KEY: JSON.stringify(process.env.GOOGLE_MAPS_KEY),
};
