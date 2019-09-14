import { Service } from "./service";

export class ThingService extends Service {
  constructor(client) {
    super(client, "thing");
  }
  async getThingByName(name) {
    return this.get(name);
  }
}
