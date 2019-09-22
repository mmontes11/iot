import _ from "underscore";
import { EmojiHandler } from "./emojiHandler";

const formatNumber = number => parseFloat(number.toFixed(2));

export class MarkdownBuilder {
  static buildHelpMessageMD() {
    let markdown = `I'm an [Internet of Things](https://en.wikipedia.org/wiki/Internet_of_things) bot. `;
    markdown += `I can notify you about anything that happens your things.\n\n`;
    markdown += `Available commands:\n`;
    markdown += `/help - Info about commands\n`;
    markdown += `/things - Lists things\n`;
    markdown += `/lastmeasurement - Gets last measurement\n`;
    markdown += `/lastevent - Gets last event\n`;
    markdown += `/measurementstats - Provides measurement stats\n`;
    markdown += `/eventstats - Provides event stats\n`;
    markdown += `/topics - Lists MQTT topics\n`;
    markdown += `/subscribe - Subscribes to a MQTT topic\n`;
    markdown += `/unsubscribe - Unsubscribes from a MQTT topic\n`;
    markdown += `/mysubscriptions - Lists subscriptions\n`;
    return markdown;
  }
  static buildThingsListMD(things) {
    let markdown = "";
    _.forEach(things, thing => {
      markdown += `${MarkdownBuilder._buildThingMD(thing)}\n`;
    });
    return markdown;
  }
  static buildLastMeasurementMD(lastParams, lastMeasurement) {
    let markdown = `Last _${lastParams.type}_ measurement of \`${lastParams.thing}\`:\n\n`;
    markdown += MarkdownBuilder._buildMeasurementElementWithEmojiMD(
      "value",
      lastParams.type,
      lastMeasurement.value,
      lastMeasurement.unit.symbol,
    );
    markdown += `*phenomenonTime*: ${lastMeasurement.phenomenonTime}`;
    return markdown;
  }
  static buildLastEventMD(lastParams, lastEvent) {
    let markdown = `Last _${lastParams.type}_ event of \`${lastParams.thing}\`:\n\n`;
    markdown += `*phenomenonTime*: ${lastEvent.phenomenonTime}\n`;
    if (!_.isUndefined(lastEvent.value)) {
      markdown += `*value*: ${lastEvent.value}\n`;
    }
    return markdown;
  }
  static buildMeasurementStatsListMD(statsParams, stats) {
    let markdown = `\`${statsParams.thing}\` measurement stats by ${statsParams.timePeriod}:\n\n`;
    _.forEach(stats, statsElement => {
      markdown += `${MarkdownBuilder._buildMeasurementStatsMD(statsElement)}\n`;
    });
    return markdown;
  }
  static buildEventStatsListMD(statsParams, stats) {
    let markdown = `\`${statsParams.thing}\` event stats by ${statsParams.timePeriod}:\n\n`;
    _.forEach(stats, statsElement => {
      markdown += `${MarkdownBuilder._buildEventStatsMD(statsElement)}\n`;
    });
    return markdown;
  }
  static buildTopicsListMD(topics) {
    let markdown = "";
    _.forEach(topics, topic => {
      markdown += `\`${topic}\`\n\n`;
    });
    return markdown;
  }
  static buildCustomTopicSubscriptionMD(topics) {
    const mqttTopicUrl = "https://www.hivemq.com/blog/mqtt-essentials-part-5-mqtt-topics-best-practices";
    let markdown = `Send me the topic you want to subscribe in [MQTT topic](${mqttTopicUrl}) format.\n`;
    if (!_.isEmpty(topics)) {
      markdown += "*FYI*: Right now, I am receiving info about this topics:\n";
      markdown += MarkdownBuilder.buildTopicsListMD(topics);
    }
    return markdown;
  }
  static buildAlreadySubscribedMD(topic) {
    let markdown = "You are already subscribed to:\n";
    markdown += `\`${topic}\``;
    return markdown;
  }
  static buildSubscriptionSuccessMD(topic) {
    let markdown = "Success! You will now receive notifications from:\n";
    markdown += `\`${topic}\``;
    return markdown;
  }
  static buildSubscriptionsMD(subscriptions) {
    let markdown = "";
    _.forEach(subscriptions, subscription => {
      markdown += `\`${subscription.topic}\`\n\n`;
    });
    return markdown;
  }
  static buildEventNotificationMD(notification) {
    let markdown = `A new *event* related to the topic \`${notification.topic}\` has just happened`;
    if (!_.isUndefined(notification.observation.value)) {
      markdown += `: *${notification.observation.value}*\n\n`;
    } else {
      markdown += "\n\n";
    }
    return markdown;
  }
  static buildMeasurementNotificationMD(notification) {
    const measurement = `*${formatNumber(notification.observation.value)}${notification.observation.unit.symbol}*`;
    return `A new *measurement* related to the topic \`${notification.topic}\` has been performed: ${measurement}\n\n`;
  }
  static buildMeasurementChangeNotificationMD(notification) {
    const {
      measurementChange: { observation, growthRate },
    } = notification;
    const growthRatePercentage = formatNumber(growthRate * 100);
    const changedText = MarkdownBuilder._changedText(growthRate);
    const measurementMD = `*${formatNumber(observation.value)}${observation.unit.symbol}*`;
    const growthRateMD = `*${growthRatePercentage > 0 ? "+" : ""}${growthRatePercentage}*`;
    return `It seems that the *measurement* related to the topic \`${
      notification.topic
    }\` is ${changedText}: ${measurementMD} (${growthRateMD}%)\n\n`;
  }
  static _buildThingMD(thing) {
    let markdown = `*thing*: \`${thing.name}\`\n`;
    markdown += `*ip*: ${thing.ip}\n`;
    markdown += `*location*: [Google Maps URL](${thing.googleMapsUrl})\n`;
    markdown += `*last observation*: ${thing.lastObservation}\n`;
    markdown += `*topic*: ${thing.topic}\n`;
    const measurements = thing.supportedObservationTypes.measurement;
    const events = thing.supportedObservationTypes.event;
    if (!_.isEmpty(measurements)) {
      markdown += "*measurements*: ";
      markdown += `${measurements.map(m => `_${m}_`).join(", ")} \n`;
    }
    if (!_.isEmpty(events)) {
      markdown += "*events*: ";
      markdown += `${events.map(e => `_${e}_`).join(", ")} \n`;
    }
    return markdown;
  }
  static _buildMeasurementStatsMD(statsElement) {
    const statsType = statsElement.type;
    const unit = statsElement.unit.symbol;
    let markdown = `*type*: _${statsType}_\n`;
    statsElement.data.forEach(dataElement => {
      markdown += MarkdownBuilder._buildMeasurementElementWithEmojiMD("avg", statsType, dataElement.avg, unit);
      markdown += MarkdownBuilder._buildMeasurementElementWithEmojiMD("max", statsType, dataElement.max, unit);
      markdown += MarkdownBuilder._buildMeasurementElementWithEmojiMD("min", statsType, dataElement.min, unit);
      markdown += `*stdDev*: ${formatNumber(dataElement.stdDev)}\n`;
    });
    return markdown;
  }
  static _buildEventStatsMD(statsElement) {
    const statsType = statsElement.type;
    let markdown = `*type*: _${statsType}_\n`;
    statsElement.data.forEach(dataElement => {
      markdown += `*total*: ${formatNumber(dataElement.total)}\n`;
      markdown += `*avgByHour*: ${formatNumber(dataElement.avgByHour)}\n`;
      markdown += `*maxByHour*: ${formatNumber(dataElement.maxByHour)}\n`;
      markdown += `*minByHour*: ${formatNumber(dataElement.minByHour)}\n`;
      markdown += `*stdDevByHour*: ${formatNumber(dataElement.stdDevByHour)}\n`;
    });
    return markdown;
  }
  static _buildMeasurementElementWithEmojiMD(statsName, statsType, value, unit) {
    let markdown = `*${statsName}*: ${formatNumber(value)}${unit}`;
    const emoji = EmojiHandler.emojiForStatsType(statsType, value);
    if (!_.isUndefined(emoji)) {
      markdown += ` ${emoji}\n`;
    } else {
      markdown += "\n";
    }
    return markdown;
  }
  static _changedText(growthRate) {
    const emoji = EmojiHandler.emojisForGrowthRate(growthRate);
    if (growthRate > 0) {
      return `growing ${emoji}`;
    } else if (growthRate < 0) {
      return `decreasing ${emoji}`;
    }
    return "not changing";
  }
}
