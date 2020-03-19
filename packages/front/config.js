require("common/config");

const getFrontSocketUrl = () => {
  const { FRONT_SOCKET_URL } = process.env;
  if (FRONT_SOCKET_URL) {
    return JSON.stringify(FRONT_SOCKET_URL);
  }
  return undefined;
};

module.exports = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  FRONT_API_URL: JSON.stringify(process.env.FRONT_API_URL),
  FRONT_SOCKET_URL: getFrontSocketUrl(),
  GOOGLE_MAPS_KEY: JSON.stringify(process.env.GOOGLE_MAPS_KEY),
};
