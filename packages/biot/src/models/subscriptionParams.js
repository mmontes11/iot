export class SubscriptionParams {
  constructor(chatId) {
    this.chatId = chatId;
  }
  setTopicType(topicType) {
    this.topicType = topicType;
  }
  setTopicId(topicId) {
    this.topicId = topicId;
  }
  setTopic(topic) {
    this.topic = topic;
  }
  toJSON() {
    return {
      chatId: this.chatId,
      topicId: this.topicId,
      topic: this.topic,
    };
  }
}
