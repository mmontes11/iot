import { Service } from "./service";

export class TopicsService extends Service {
  constructor(client) {
    super(client, "topics");
  }
  async getTopics() {
    const options = { auth: true };
    return this.get(undefined, options);
  }
}
