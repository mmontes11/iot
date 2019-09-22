import { Service } from "./service";

export class ObservationsService extends Service {
  constructor(client) {
    super(client, "observations");
  }
  async create(observations) {
    return this.post(undefined, undefined, observations);
  }
}
