import { MongoModel } from "./mongoModel";
import mongo from "../lib/mongo";

class MeasurementChange extends MongoModel {
  insertOne(measurementChange) {
    return this.collection().insertOne(measurementChange);
  }
}

const measurement = new MeasurementChange(mongo, "measurementChanges");

export default measurement;
