import Promise from "bluebird";
import _ from "underscore";
import log from "../../utils/log";
import { MarkdownBuilder } from "../../helpers/markdownBuilder";

class NotificationsController {
  constructor(telegramBot) {
    this.bot = telegramBot;
  }
  async handleNotifications(notifications, buildNotificationMD) {
    log.logReceivedNotifications(notifications);
    const sendMessagePromises = _.map(notifications, notification =>
      this._handleNotification(notification, buildNotificationMD).reflect(),
    );
    const sentNotifications = [];
    const erroredNotifications = [];
    try {
      await Promise.all(sendMessagePromises).each((inspection, index) => {
        if (inspection.isFulfilled()) {
          sentNotifications.push(inspection.value());
        } else {
          erroredNotifications.push(notifications[index]);
        }
      });
      return {
        sentNotifications,
        erroredNotifications,
      };
    } catch (err) {
      throw err;
    }
  }
  _handleNotification(notification, buildNotificationMD) {
    return new Promise((resolve, reject) => {
      const options = {
        parse_mode: "Markdown",
      };
      const markdown = buildNotificationMD(notification);
      this.bot
        .sendMessage(notification.chatId, markdown, options)
        .then(msg => {
          log.logMessage(msg);
          resolve(notification);
        })
        .catch(err => {
          log.logError(err);
          reject(err);
        });
    });
  }
}

class EventNotificationsController extends NotificationsController {
  handleNotifications(notifications) {
    return super.handleNotifications(notifications, MarkdownBuilder.buildEventNotificationMD);
  }
}

class MeasurementNotificationsController extends NotificationsController {
  handleNotifications(notifications) {
    return super.handleNotifications(notifications, MarkdownBuilder.buildMeasurementNotificationMD);
  }
}

class MeasurementChangeNotificationsController extends NotificationsController {
  handleNotifications(notifications) {
    return super.handleNotifications(notifications, MarkdownBuilder.buildMeasurementChangeNotificationMD);
  }
}

export { EventNotificationsController, MeasurementNotificationsController, MeasurementChangeNotificationsController };
