const { createLogger, format, transports } = require("winston");

const { DEBUG } = process.env;

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "log-iot-thing.log",
    }),
  ],
});

const logInfo = message => {
  if (DEBUG) {
    logger.info(message);
  }
};

const logError = message => {
  if (DEBUG) {
    logger.error(message);
  }
};

module.exports = { logInfo, logError };
