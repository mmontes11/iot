import winston from "../lib/winston";

const { IOT_DEBUG } = process.env;

const logInfo = message => {
  if (IOT_DEBUG) {
    winston.info(message);
  }
};

const logError = message => {
  if (IOT_DEBUG) {
    winston.error(message);
  }
};

export { logInfo, logError };
