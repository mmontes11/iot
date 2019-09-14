import { Service } from "./service";

export class SubscriptionService extends Service {
  constructor(client) {
    super(client, "subscription");
  }
  async subscribe(subscription) {
    return this.post(undefined, undefined, subscription);
  }
  async unSubscribe(subscriptionId) {
    return this.del(subscriptionId);
  }
}
