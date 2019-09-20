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

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

export const connectWithRetry = () =>
  mongoose.connect(config.mongoUrl, options, err => {
    if (err) {
      setTimeout(connectWithRetry, 5000);
    }
  });

export default mongoose;
