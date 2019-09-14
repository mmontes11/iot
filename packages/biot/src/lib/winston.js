import winston from "winston";

const logger = new winston.Logger({
  level: "info",
  transports: [
    new winston.transports.Console({
      timestamp: false,
      json: false,
      colorize: true,
    }),
    new winston.transports.File({
      timestamp: true,
      json: false,
      colorize: true,
      filename: "log-biot.log",
    }),
  ],
});

export default logger;
