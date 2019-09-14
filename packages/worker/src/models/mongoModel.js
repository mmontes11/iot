export class MongoModel {
  constructor(mongo, collectionName) {
    this.mongo = mongo;
    this.collectionName = collectionName;
  }
  collection() {
    return this.mongo.db.collection(this.collectionName);
  }
}
