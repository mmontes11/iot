import { MarkdownBuilder } from "../helpers/markdownBuilder";

export class ResponseHandler {
  constructor(telegramBot) {
    this.bot = telegramBot;
  }
  handleCreateSubscriptionResponse(res, chatId) {
    const {
      body: { topic },
    } = res;
    const markdown = MarkdownBuilder.buildSubscriptionSuccessMD(topic);
    const options = {
      parse_mode: "Markdown",
    };
    this.bot.sendMessage(chatId, markdown, options);
  }
}
