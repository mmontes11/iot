const { createLogger, format, transports } = require("winston");

const { IOT_DEBUG } = process.env;

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
  if (IOT_DEBUG) {
    logger.info(message);
  }
};

const logError = message => {
  if (IOT_DEBUG) {
    logger.error(message);
  }
};

module.exports = { logInfo, logError };
