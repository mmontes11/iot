require("dotenv/config");

const getFrontSocketUrl = () => {
  const { SOCKET_URL } = process.env;
  if (SOCKET_URL) {
    return JSON.stringify(SOCKET_URL);
  }
  return undefined;
};

module.exports = {
  API_URL: JSON.stringify(process.env.API_URL),
  SOCKET_URL: getFrontSocketUrl(),
  GOOGLE_MAPS_KEY: JSON.stringify(process.env.GOOGLE_MAPS_KEY),
};
