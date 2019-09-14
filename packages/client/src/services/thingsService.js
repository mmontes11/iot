import { Service } from "./service";

export class ThingsService extends Service {
  constructor(client) {
    super(client, "things");
  }
  async getThings(supportsMeasurements, supportsEvents) {
    const options = {
      query: {
        supportsMeasurements,
        supportsEvents,
      },
    };
    return this.get(undefined, options);
  }
}
