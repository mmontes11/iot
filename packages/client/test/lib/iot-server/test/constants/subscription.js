export default {
  validSubscription: {
    chatId: 1234,
    topic: "home/room/raspi/measurement/temperature",
  },
  validSubscription2: {
    chatId: 5678,
    topic: "home/room/raspi/measurement/humidity",
  },
  validSubscription3: {
    chatId: 5678,
    thing: "raspi",
    topic: "home/room/raspi/event/door-opened",
  },
  invalidSubscription: {
    chatId: 5678,
  },
  subscriptionWithInvalidTopicId: {
    chatId: 5678,
    topicId: "whatever",
  },
  validChatId: 1234,
  validChatId2: 5678,
  invalidChatId: "foo",
  invalidSubscriptionId: 1,
  nonExistingSubscriptionId: "5a9a7c4be72f3003bc5e5798",
};
