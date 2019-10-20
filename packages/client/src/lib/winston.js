import { createLogger, format, transports } from "winston";
import { MultiPlatformHelper } from "../helpers/multiPlatformHelper";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
  ),
});

logger.add(new transports.Console());

if (!MultiPlatformHelper.isBrowser()) {
  logger.add(new transports.File({ filename: "log-iot-client.log" }));
}

export default logger;
