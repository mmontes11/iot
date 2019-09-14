import _ from "underscore";
import errorMessages from "../../utils/errorMessages";
import config from "../../config/index";

export class AuthController {
  constructor(telegramBot) {
    this.bot = telegramBot;
    this.usersWhileList = config.biotTelegramWhiteListJson;
  }
  isAuthorized(msg) {
    const user = msg.from.username;
    return _.contains(this.usersWhileList, user);
  }
  sendNotAuthorizedMessage(msg) {
    const chatId = msg.chat.id;
    this.bot.sendMessage(chatId, errorMessages.notAuthorizedError);
  }
}
