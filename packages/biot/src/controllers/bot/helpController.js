import { MarkdownBuilder } from "../../helpers/markdownBuilder";

export class HelpController {
  constructor(telegramBot) {
    this.bot = telegramBot;
  }
  sendHelpMessage(msg) {
    const chatId = msg.chat.id;
    const markdown = MarkdownBuilder.buildHelpMessageMD();
    const options = {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    };
    this.bot.sendMessage(chatId, markdown, options);
  }
}
