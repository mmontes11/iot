import { Service } from "./service";

export class SubscriptionService extends Service {
  constructor(client) {
    super(client, "subscription");
  }
  async subscribe(subscription) {
    const options = { auth: true };
    return this.post(undefined, subscription, options);
  }
  async unSubscribe(subscriptionId) {
    const options = { auth: true };
    return this.delete(subscriptionId, options);
  }
}
