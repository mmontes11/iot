import _ from "underscore";
import { TopicController } from "./topicController";
import subscriptionModel from "../models/subscriptionModel";
import measurementModel from "../models/measurementModel";
import measurementChangeModel from "../models/measurementChangeModel";
import biotClient from "../lib/biotClient";
import mqtt from "../lib/mqtt";

const { MEASUREMENT_TOPIC, MEASUREMENT_CHANGE_TOPIC } = process.env;

const checkNotifications = (notifications, topic) => {
  if (!_.isEmpty(notifications)) {
    return notifications;
  }
  throw new Error(`No notifications for topic ${topic}`);
};

const getNotifications = async (topic, observation) => {
  try {
    const notifications = await subscriptionModel.getNotificationsForSubscriptions(topic, "observation", observation);
    checkNotifications(notifications, topic);
    return notifications;
  } catch (err) {
    throw err;
  }
};

class EventController extends TopicController {
  static async handleTopic(topic, event) {
    try {
      const notifications = await getNotifications(topic, event);
      await biotClient.sendEventNotifications(notifications);
    } catch (err) {
      throw err;
    }
  }
}

class MeasurementController extends TopicController {
  canHandleTopic(topic) {
    return super.canHandleTopic(topic) && !topic.includes(MEASUREMENT_CHANGE_TOPIC);
  }
  static async handleTopic(topic, measurement) {
    try {
      await Promise.all([
        MeasurementController._sendMeasurementNotifications(topic, measurement),
        MeasurementController._processMeasurementChange(topic, measurement),
      ]);
    } catch (err) {
      throw err;
    }
  }
  static async _sendMeasurementNotifications(topic, measurement) {
    try {
      const notifications = await getNotifications(topic, measurement);
      await biotClient.sendMeasurementNotifications(notifications);
    } catch (err) {
      throw err;
    }
  }
  static async _processMeasurementChange(topic, measurement) {
    try {
      const growthRate = await measurementModel.getMeasurementGrowthRate(measurement);
      if (!_.isUndefined(growthRate)) {
        const measurementChange = {
          observation: measurement,
          growthRate,
          phenomenonTime: new Date(),
        };
        await measurementChangeModel.insertOne(measurementChange);

        const measurementChangeTopic = topic.replace(MEASUREMENT_TOPIC, MEASUREMENT_CHANGE_TOPIC);
        await mqtt.publishJSON(measurementChangeTopic, measurementChange);
      }
    } catch (err) {
      throw err;
    }
  }
}

export { EventController, MeasurementController };
