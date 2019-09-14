import _ from "underscore";
import matchTopic from "mqtt-match";
import mongo from "../lib/mongo";
import { MongoModel } from "./mongoModel";

class SubscriptionModel extends MongoModel {
  find(query = {}) {
    return this.collection().find(query);
  }
  async getNotificationsForSubscriptions(topic, notificationExtraFieldKey, notificationExtraField) {
    const notifications = [];
    const cursor = this.find();
    while (await cursor.hasNext()) {
      const subscription = await cursor.next();
      const notificationAlreadyExists = _.some(notifications, notification =>
        _.isEqual(notification.chatId, subscription.chatId),
      );
      if (!notificationAlreadyExists && matchTopic(subscription.topic, topic)) {
        notifications.push({
          chatId: subscription.chatId,
          topic,
          [notificationExtraFieldKey]: notificationExtraField,
        });
      }
    }
    return notifications;
  }
}

const subscriptionModel = new SubscriptionModel(mongo, "subscriptions");

export default subscriptionModel;
