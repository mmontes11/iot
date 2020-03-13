const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

let biotTelegramWhiteListJson;
try {
  biotTelegramWhiteListJson = JSON.parse(process.env.BIOT_USERS_WHITELIST_JSON);
} catch (_) {
  biotTelegramWhiteListJson = [];
}

const derivedConfig = {
  backBasicAuthUsers: {
    [process.env.BACK_BASIC_AUTH_USER]: process.env.BACK_BASIC_AUTH_PASSWORD,
  },
  biotBasicAuthUsers: {
    [process.env.BIOT_BASIC_AUTH_USER]: process.env.BIOT_BASIC_AUTH_PASSWORD,
  },
  biotGrowthRateModerateAbsoluteThreshold: parseFloat(process.env.BIOT_GROWTH_RATE_MODERATE_ABSOLUTE_THREESHOLD),
  biotGrowthRateHighAbsoluteThreshold: parseFloat(process.env.BIOT_GROWTH_RATE_HIGH_ABSOLUTE_THREESHOLD),
  biotHighHumidityThreshold: parseFloat(process.env.BIOT_HIGH_HUMIDITY_THRESHOLD),
  biotHighTemperatureThreshold: parseFloat(process.env.BIOT_HIGH_TEMPERATURE_THRESHOLD),
  biotLowHumidityThreshold: parseFloat(process.env.BIOT_LOW_HUMIDITY_THRESHOLD),
  biotLowTemperatureThreshold: parseFloat(process.env.BIOT_LOW_TEMPERATURE_THRESHOLD),
  biotTelegramWhiteListJson,
  measurementChangePastIntervalInHours: parseFloat(process.env.MEASUREMENT_CHANGE_PAST_INTERVAL_IN_HOURS),
  measurementChangeGrowthRateThreshold: parseFloat(process.env.MEASUREMENT_CHANGE_GROWTH_RATE_THRESHOLD),
};

module.exports = {
  derivedConfig,
};
