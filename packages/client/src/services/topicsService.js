import { Service } from "./service";

export class TopicsService extends Service {
  constructor(client) {
    super(client, "topics");
  }
  async getTopics() {
    return this.get();
  }
}
