import _ from "underscore";
import config from "../../config";
import errorMessages from "../../utils/errorMessages";

export class AuthController {
  constructor(telegramBot) {
    this.bot = telegramBot;
    this.usersWhileList = config.telegramUsersWhiteList;
  }
  isAuthorized(msg) {
    const user = msg.from.username;
    if (this.usersWhileList) {
      return _.contains(this.usersWhileList, user);
    }
    return true;
  }
  sendNotAuthorizedMessage(msg) {
    const chatId = msg.chat.id;
    this.bot.sendMessage(chatId, errorMessages.notAuthorizedError);
  }
}
