import "mongoose-geojson-schema";
import "mongoose-schema-extend";
import Promise from "bluebird";
import mongoose from "mongoose";
import config from "../config/index";
import { logInfo } from "../utils/log";

mongoose.Promise = Promise;

if (config.debug) {
  mongoose.set("debug", (collectionName, method, query, result) => {
    logInfo(`MongoDB query: ${collectionName}.${method}(${JSON.stringify(query)})`);
    logInfo(`MongoDB result: ${JSON.stringify(result)}`);
  });
}

mongoose.connect(config.mongoUrl, { useMongoClient: true });

export default mongoose;
