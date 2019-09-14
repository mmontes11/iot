import { Service } from "./service";

export class SubscriptionsService extends Service {
  constructor(client) {
    super(client, "subscriptions");
  }
  async getSubscriptionsByChat(chatId) {
    const options = {
      query: {
        chatId,
      },
    };
    return this.get(undefined, options);
  }
}
