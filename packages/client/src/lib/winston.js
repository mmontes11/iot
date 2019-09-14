import { createLogger, format, transports } from "winston";
import { MultiPlatformHelper } from "../helpers/multiPlatformHelper";
import { BrowserConsole } from "../util/browserConsole";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
  ),
});

if (MultiPlatformHelper.isBrowser()) {
  logger.add(new BrowserConsole());
} else {
  logger.add(new transports.Console());
  logger.add(
    new transports.File({
      filename: "log-iot-client.log",
    }),
  );
}

export default logger;
