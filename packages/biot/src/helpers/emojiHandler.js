import emojiLib from "node-emoji";
import { derivedConfig } from "common/config";

const { BIOT_TEMPERATURE_PREFIX, BIOT_HUMIDITY_PREFIX } = process.env;

const {
  biotHighTemperatureThreshold,
  biotLowTemperatureThreshold,
  biotHighHumidityThreshold,
  biotLowHumidityThreshold,
  biotGrowthRateHighAbsoluteThreshold,
  biotGrowthRateModerateAbsoluteThreshold,
} = derivedConfig;

export class EmojiHandler {
  static emojiForStatsType(statsType, value) {
    if (statsType.startsWith(BIOT_TEMPERATURE_PREFIX)) {
      if (value >= biotHighTemperatureThreshold) {
        return emojiLib.get("fire");
      } else if (value <= biotLowTemperatureThreshold) {
        return emojiLib.get("snowflake");
      }
    } else if (statsType.startsWith(BIOT_HUMIDITY_PREFIX)) {
      if (value >= biotHighHumidityThreshold) {
        return emojiLib.get("droplet");
      } else if (value <= biotLowHumidityThreshold) {
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
    if (growthRateAbsolute >= biotGrowthRateHighAbsoluteThreshold) {
      numEmojis = 3;
    } else if (growthRateAbsolute >= biotGrowthRateModerateAbsoluteThreshold) {
      numEmojis = 2;
    }
    let emojis = "";
    for (let i = 0; i < numEmojis; i += 1) {
      emojis += `${emoji}`;
    }
    return emojis;
  }
}
