import "mongoose-geojson-schema";
import Promise from "bluebird";
import mongoose from "mongoose";
import config from "../config";
import { logInfo } from "../utils/log";

mongoose.Promise = Promise;

if (config.debug) {
  mongoose.set("debug", (collectionName, method, query, result) => {
    logInfo(`MongoDB query: ${collectionName}.${method}(${JSON.stringify(query)})`);
    logInfo(`MongoDB result: ${JSON.stringify(result)}`);
  });
}

mongoose.connect(config.mongoUrl);

export default mongoose;
