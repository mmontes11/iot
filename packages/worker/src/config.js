const { MEASUREMENT_CHANGE_GROWTH_RATE_THRESHOLD, MEASUREMENT_CHANGE_PAST_INTERVAL_IN_HOURS } = process.env;

const config = {
  measurementChangeGrowthRateThreshold: parseFloat(MEASUREMENT_CHANGE_GROWTH_RATE_THRESHOLD),
  measurementChangePastIntervalInHours: parseFloat(MEASUREMENT_CHANGE_PAST_INTERVAL_IN_HOURS),
};

export default config;
