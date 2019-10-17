import { Service } from "./service";

export class TimePeriodsService extends Service {
  constructor(client) {
    super(client, "timePeriods");
  }
  async getSupportedTimePeriods() {
    const options = { auth: true };
    return this.get(undefined, options);
  }
}
