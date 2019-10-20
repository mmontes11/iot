import { Service } from "./service";

export class ObservationsService extends Service {
  constructor(client) {
    super(client, "observations");
  }
  async create(observations) {
    const options = { auth: true };
    return this.post(undefined, observations, options);
  }
}
