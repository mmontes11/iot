import emojiLib from "node-emoji";
import config from "../config/index";

export class EmojiHandler {
  static emojiForStatsType(statsType, value) {
    if (statsType.startsWith(config.biotTemperaturePrefix)) {
      if (value >= config.biotHighTemperatureThreshold) {
        return emojiLib.get("fire");
      } else if (value <= config.biotLowTemperatureThreshold) {
        return emojiLib.get("snowflake");
      }
    } else if (statsType.startsWith(config.biotHumidityPrefix)) {
      if (value >= config.biotHighHumidityThreshold) {
        return emojiLib.get("droplet");
      } else if (value <= config.biotLowHumidityThreshold) {
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
    if (growthRateAbsolute >= config.biotGrowthRateHighAbsoluteThreshold) {
      numEmojis = 3;
    } else if (growthRateAbsolute >= config.biotGrowthRateModerateAbsoluteThreshold) {
      numEmojis = 2;
    }
    let emojis = "";
    for (let i = 0; i < numEmojis; i += 1) {
      emojis += `${emoji}`;
    }
    return emojis;
  }
}
