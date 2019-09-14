import mongoose from "../lib/mongoose";

const SubscriptionSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
});

SubscriptionSchema.index({ chatId: 1, topic: 1 }, { unique: true });

SubscriptionSchema.statics.findSubscription = function findSubscription(subscription) {
  const findCriteria = {
    chatId: subscription.chatId,
    topic: subscription.topic,
  };
  return this.findOne(findCriteria);
};

SubscriptionSchema.statics.findSubscriptionById = function findSubscriptionById(subscriptionId) {
  const objectId = mongoose.Types.ObjectId(subscriptionId);
  return this.findOne(objectId);
};

const SubscriptionModel = mongoose.model("Subscription", SubscriptionSchema);

export { SubscriptionSchema, SubscriptionModel };
