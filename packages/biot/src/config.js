const {
  BASIC_AUTH_PASSWORD,
  BASIC_AUTH_USER,
  GROWTH_RATE_HIGH_ABSOLUTE_THREESHOLD,
  GROWTH_RATE_MODERATE_ABSOLUTE_THREESHOLD,
  HIGH_HUMIDITY_THRESHOLD,
  HIGH_TEMPERATURE_THRESHOLD,
  LOW_HUMIDITY_THRESHOLD,
  LOW_TEMPERATURE_THRESHOLD,
  TELEGRAM_USERS_WHITELIST_JSON,
} = process.env;

let telegramUsersWhiteList;
try {
  telegramUsersWhiteList = JSON.parse(TELEGRAM_USERS_WHITELIST_JSON);
} catch (_) {
  telegramUsersWhiteList = null;
}

const config = {
  basicAuthUsers: {
    [BASIC_AUTH_USER]: BASIC_AUTH_PASSWORD,
  },
  growthRateHighAbsoluteThreshold: parseFloat(GROWTH_RATE_HIGH_ABSOLUTE_THREESHOLD),
  growthRateModerateAbsoluteThreshold: parseFloat(GROWTH_RATE_MODERATE_ABSOLUTE_THREESHOLD),
  highHumidityThreshold: parseFloat(HIGH_HUMIDITY_THRESHOLD),
  highTemperatureThreshold: parseFloat(HIGH_TEMPERATURE_THRESHOLD),
  lowHumidityThreshold: parseFloat(LOW_HUMIDITY_THRESHOLD),
  lowTemperatureThreshold: parseFloat(LOW_TEMPERATURE_THRESHOLD),
  telegramUsersWhiteList,
};

export default config;
