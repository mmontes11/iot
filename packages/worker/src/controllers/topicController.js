export class TopicController {
  constructor(topic) {
    this.topic = topic;
  }
  canHandleTopic(topic) {
    return topic.includes(this.topic);
  }
}
