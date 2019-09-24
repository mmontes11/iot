import { MongoClient } from "mongodb";
import log from "../utils/log";

const { MONGO_URL, MONGO_DB } = process.env;

class Mongo {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
    this.dbUrl = `${this.url}/${this.dbName}`;
  }
  async connect() {
    try {
      this.client = await MongoClient.connect(this.url);
      this.db = this.client.db(this.dbName);
    } catch (err) {
      log.logError(err);
      setTimeout(() => this.connect(), 5000);
    }
  }
  async close() {
    try {
      await this.client.close();
    } catch (err) {
      log.logError(err);
    }
  }
}

const mongo = new Mongo(MONGO_URL, MONGO_DB);

export default mongo;
