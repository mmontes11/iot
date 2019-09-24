import mqttLib from "../lib/mqtt";
import { EventController, MeasurementController } from "./observationController";
import { MeasurementChangeController } from "./measurementChangeController";
import topicModel from "../models/topicModel";
import log from "../utils/log";

const { EVENT_TOPIC, MEASUREMENT_TOPIC, MEASUREMENT_CHANGE_TOPIC } = process.env;

class MQTTController {
  constructor(mqtt, eventTopic, measurementTopic, measurementChangeTopic) {
    this.mqtt = mqtt;
    this.eventController = new EventController(eventTopic);
    this.measurementController = new MeasurementController(measurementTopic);
    this.measurementChangeController = new MeasurementChangeController(measurementChangeTopic);
  }
  async listen() {
    try {
      await this.mqtt.client.subscribe("#");
    } catch (err) {
      throw err;
    }
    this.mqtt.client.on("message", async (topic, message) => {
      let json;
      try {
        json = JSON.parse(message.toString());
      } catch (err) {
        log.logError(err);
        return;
      }
      log.logMQTTTReceivedMessage(topic, json);

      const promises = [];
      promises.push(topicModel.upsertTopic(topic));
      if (this.eventController.canHandleTopic(topic)) {
        promises.push(EventController.handleTopic(topic, json));
      }
      if (this.measurementController.canHandleTopic(topic)) {
        promises.push(MeasurementController.handleTopic(topic, json));
      }
      if (this.measurementChangeController.canHandleTopic(topic)) {
        promises.push(MeasurementChangeController.handleTopic(topic, json));
      }
      try {
        await Promise.all(promises);
      } catch (err) {
        log.logError(err);
      }
    });
  }
}

const mqttController = new MQTTController(mqttLib, EVENT_TOPIC, MEASUREMENT_TOPIC, MEASUREMENT_CHANGE_TOPIC);

export default mqttController;
