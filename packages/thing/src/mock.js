const TEMPERATURE = "temperature";
const HUMIDITY = "humidity";
const temperatureRange = [5, 35];
const humidityRange = [30, 90];
const diffFactor = 0.1;

const getRandomValue = ([min, max]) => Math.random() * (max - min) + min;

const getValue = (range, prevValue) => {
  if (!prevValue) {
    return getRandomValue(range);
  }
  const [min, max] = range;
  const { value } = prevValue;
  const valueMin = value + value * (diffFactor * -1);
  const valueMax = value + value * diffFactor;
  const diffRange = [Math.max(min, valueMin), Math.min(max, valueMax)];
  return getRandomValue(diffRange);
};

const getDataOfType = (type, prevValue) => {
  if (type.startsWith(TEMPERATURE)) {
    return {
      value: getValue(temperatureRange, prevValue),
      unit: {
        name: "degrees",
        symbol: "ºC",
      },
    };
  }
  if (type.startsWith(HUMIDITY)) {
    return {
      value: getValue(humidityRange, prevValue),
      unit: {
        name: "relative",
        symbol: "%",
      },
    };
  }
  return null;
};

const getData = ({ type, thing }, prevValue = null) => ({
  type,
  thing,
  phenomenonTime: new Date().toISOString(),
  ...getDataOfType(type, prevValue),
});

module.exports = getData;
