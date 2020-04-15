import emojiLib from "node-emoji";
import config from "../config";

const { TEMPERATURE_PREFIX, HUMIDITY_PREFIX } = process.env;

const {
  highTemperatureThreshold,
  lowTemperatureThreshold,
  highHumidityThreshold,
  lowHumidityThreshold,
  growthRateHighAbsoluteThreshold,
  growthRateModerateAbsoluteThreshold,
} = config;

export class EmojiHandler {
  static emojiForStatsType(statsType, value) {
    if (statsType.startsWith(TEMPERATURE_PREFIX)) {
      if (value >= highTemperatureThreshold) {
        return emojiLib.get("fire");
      } else if (value <= lowTemperatureThreshold) {
        return emojiLib.get("snowflake");
      }
    } else if (statsType.startsWith(HUMIDITY_PREFIX)) {
      if (value >= highHumidityThreshold) {
        return emojiLib.get("droplet");
      } else if (value <= lowHumidityThreshold) {
        return emojiLib.get("cactus");
      }
    }
    return undefined;
  }
  static emojisForGrowthRate(growthRate) {
    const emojiName = growthRate > 0 ? "chart_with_upwards_trend" : "chart_with_downwards_trend";
    const emoji = emojiLib.get(emojiName);
    const growthRateAbsolute = Math.abs(growthRate);
    let numEmojis = 1;
    if (growthRateAbsolute >= growthRateHighAbsoluteThreshold) {
      numEmojis = 3;
    } else if (growthRateAbsolute >= growthRateModerateAbsoluteThreshold) {
      numEmojis = 2;
    }
    let emojis = "";
    for (let i = 0; i < numEmojis; i += 1) {
      emojis += `${emoji}`;
    }
    return emojis;
  }
}
