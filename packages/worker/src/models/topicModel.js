import mongo from "../lib/mongo";
import { MongoModel } from "./mongoModel";

class TopicModel extends MongoModel {
  upsertTopic(topic) {
    return this.collection().updateOne({ topic }, { $set: { topic } }, { upsert: true });
  }
}

const topicModel = new TopicModel(mongo, "topics");

export default topicModel;
