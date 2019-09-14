import { MarkdownBuilder } from "../../helpers/markdownBuilder";
import { ErrorHandler } from "../../helpers/errorHandler";

export class ThingsController {
  constructor(telegramBot, iotClient) {
    this.bot = telegramBot;
    this.iotClient = iotClient;
    this.errorHandler = new ErrorHandler(telegramBot);
  }
  async handleThingsCommand(msg) {
    const chatId = msg.chat.id;
    try {
      const {
        body: { things },
      } = await this.iotClient.thingsService.getThings();
      const markdown = MarkdownBuilder.buildThingsListMD(things);
      const options = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      };
      this.bot.sendMessage(chatId, markdown, options);
    } catch (err) {
      this.errorHandler.handleThingsError(err, chatId);
    }
  }
}
