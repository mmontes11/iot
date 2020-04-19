import winston from "../lib/winston";

const { DEBUG } = process.env;

const logInfo = message => {
  if (DEBUG) {
    winston.info(message);
  }
};

const logError = message => {
  if (DEBUG) {
    winston.error(message);
  }
};

export { logInfo, logError };
