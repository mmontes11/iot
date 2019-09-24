import "mongoose-geojson-schema";
import Promise from "bluebird";
import mongoose from "mongoose";
import { logInfo } from "../utils/log";

mongoose.Promise = Promise;

if (process.env.IOT_DEBUG) {
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
  mongoose.connect(process.env.MONGO_URL, options, err => {
    if (err) {
      setTimeout(connectWithRetry, 5000);
    }
  });

export default mongoose;
