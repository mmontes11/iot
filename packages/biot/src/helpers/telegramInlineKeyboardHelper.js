import _ from "underscore";

export class TelegramInlineKeyboardHelper {
  static rows(inlineKeyboardButtons) {
    return _.map(inlineKeyboardButtons, inlineKeyboardButton => [inlineKeyboardButton]);
  }
}
