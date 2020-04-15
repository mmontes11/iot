import _ from "underscore";
import { TopicController } from "./topicController";
import subscriptionModel from "../models/subscriptionModel";
import biotClient from "../lib/biotClient";
import config from "../config";

export class MeasurementChangeController extends TopicController {
  static async handleTopic(topic, measurementChange) {
    if (Math.abs(measurementChange.growthRate) >= config.measurementChangeGrowthRateThreshold) {
      try {
        const maybeNotifications = await subscriptionModel.getNotificationsForSubscriptions(
          topic,
          "measurementChange",
          measurementChange,
        );
        const notifications = MeasurementChangeController._returnNotifications(maybeNotifications, topic);
        await biotClient.sendMeasurementChangeNotifications(notifications);
      } catch (err) {
        throw err;
      }
    }
  }
  static _returnNotifications(notifications, topic) {
    if (!_.isEmpty(notifications)) {
      return notifications;
    }
    throw new Error(`No notifications for topic ${topic}`);
  }
}
