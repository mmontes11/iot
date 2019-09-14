require("dotenv").config();
const config = require(`./${process.env.NODE_ENV}`).default;

export default config;
