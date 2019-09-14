import _ from "underscore";
import { MarkdownBuilder } from "../../helpers/markdownBuilder";
import { ErrorHandler } from "../../helpers/errorHandler";

export class TopicsController {
  constructor(telegramBot, iotClient) {
    this.bot = telegramBot;
    this.iotClient = iotClient;
    this.errorHandler = new ErrorHandler(telegramBot);
  }
  async handleTopicsCommand(msg) {
    const chatId = msg.chat.id;
    try {
      const res = await this.iotClient.topicsService.getTopics();
      const topics = _.map(res.body.topics, topicObject => topicObject.topic);
      const markdown = MarkdownBuilder.buildTopicsListMD(topics);
      const options = {
        parse_mode: "Markdown",
      };
      this.bot.sendMessage(chatId, markdown, options);
    } catch (err) {
      this.errorHandler.handleTopicsError(err, chatId);
    }
  }
}
