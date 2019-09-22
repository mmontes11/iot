import { Service } from "./service";

export class TimePeriodsService extends Service {
  constructor(client) {
    super(client, "timePeriods");
  }
  async getSupportedTimePeriods() {
    return this.get();
  }
}
