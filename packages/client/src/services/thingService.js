import { Service } from "./service";

export class ThingService extends Service {
  constructor(client) {
    super(client, "thing");
  }
  async getThingByName(name) {
    const options = { auth: true };
    return this.get(name, options);
  }
}
