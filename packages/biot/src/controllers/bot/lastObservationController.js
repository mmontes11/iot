import _ from "underscore";
import { ErrorHandler } from "../../helpers/errorHandler";
import { CallbackData, CallbackDataType } from "../../models/callbackData";
import { LastParams } from "../../models/lastParams";
import { TelegramInlineKeyboardHelper } from "../../helpers/telegramInlineKeyboardHelper";
import { MarkdownBuilder } from "../../helpers/markdownBuilder";
import messages from "../../utils/messages";

class LastObservationController {
  constructor(telegramBot, thingCallbackDataType, typeCallbackDataType, getThings, getTypes, getLast, getMarkdown) {
    this.bot = telegramBot;
    this.errorHandler = new ErrorHandler(telegramBot);
    this.thingCallbackDataType = thingCallbackDataType;
    this.typeCallbackDataType = typeCallbackDataType;
    this.supportedCallbackDataTypes = [this.thingCallbackDataType, this.typeCallbackDataType];
    this.getThings = getThings;
    this.getTypes = getTypes;
    this.getLast = getLast;
    this.getMarkdown = getMarkdown;
    this.lastParamsByChat = [];
  }
  handleLastCommand(msg) {
    const chatId = msg.chat.id;
    this._start(chatId);
  }
  canHandleCallbackData(callbackData) {
    return _.contains(this.supportedCallbackDataTypes, callbackData.type);
  }
  handleCallbackQuery(callbackQuery, callbackData) {
    const chatId = callbackQuery.message.chat.id;
    const lastParams = this._getOrCreateLastParams(chatId);
    const answerCallbackQuery = () => this.bot.answerCallbackQuery(callbackQuery.id);
    const reset = () => {
      answerCallbackQuery();
      this._start(chatId);
    };
    switch (callbackData.type) {
      case this.thingCallbackDataType: {
        if (_.isUndefined(lastParams.thing)) {
          lastParams.setThing(callbackData.data);
          this._selectType(chatId, lastParams, answerCallbackQuery);
        } else {
          reset();
        }
        break;
      }
      case this.typeCallbackDataType: {
        if (!_.isUndefined(lastParams.thing) && _.isUndefined(lastParams.type)) {
          lastParams.setType(callbackData.data);
          this._deleteLastParams(chatId);
          this._showLastObservation(chatId, lastParams, answerCallbackQuery);
        } else {
          reset();
        }
        break;
      }
      default: {
        reset();
      }
    }
  }
  _start(chatId) {
    this._deleteLastParams(chatId);
    this._selectThing(chatId);
  }
  async _selectThing(chatId) {
    try {
      const {
        body: { things },
      } = await this.getThings();
      const inlineKeyboardButtons = _.map(things, thing => {
        const callbackData = new CallbackData(this.thingCallbackDataType, thing.name);
        return {
          text: thing.name,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      this.bot.sendMessage(chatId, messages.thingSelectMessage, options);
    } catch (err) {
      this.errorHandler.handleThingsError(err, chatId);
    }
  }
  async _selectType(chatId, lastParams, answerCallbackQuery) {
    try {
      const types = await this.getTypes(lastParams.thing);
      const inlineKeyboardButtons = _.map(types, type => {
        const callbackData = new CallbackData(this.typeCallbackDataType, type);
        return {
          text: type,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      answerCallbackQuery();
      this.bot.sendMessage(chatId, messages.typeSelectMessage, options);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleTypesError(err, chatId);
    }
  }
  async _showLastObservation(chatId, lastParams, answerCallbackQuery) {
    try {
      const { body: lastObservation } = await this.getLast(lastParams.thing, lastParams.type);
      const markdown = this.getMarkdown(lastParams, lastObservation);
      const options = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      };
      answerCallbackQuery();
      this.bot.sendMessage(chatId, markdown, options);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleLastError(err, chatId);
    }
  }
  _deleteLastParams(chatId) {
    const lastParamsIndex = _.find(this.lastParamsByChat, params => params.chatId === chatId);
    if (lastParamsIndex !== -1) {
      this.lastParamsByChat.splice(lastParamsIndex, 1);
    }
  }
  _getOrCreateLastParams(chatId) {
    let lastParams = _.find(this.lastParamsByChat, params => params.chatId === chatId);
    if (_.isUndefined(lastParams)) {
      lastParams = new LastParams(chatId);
      this.lastParamsByChat.push(lastParams);
      return lastParams;
    }
    return lastParams;
  }
}

class LastMeasurementController extends LastObservationController {
  constructor(telegramBot, iotClient) {
    super(
      telegramBot,
      CallbackDataType.thingLastMeasurement,
      CallbackDataType.typeLastMeasurement,
      () => iotClient.thingsService.getThings(true, undefined),
      async thing => {
        try {
          const {
            body: {
              supportedObservationTypes: { measurement },
            },
          } = await iotClient.thingService.getThingByName(thing);
          return measurement;
        } catch (err) {
          throw err;
        }
      },
      (thing, type) => iotClient.measurementService.getLast(thing, type),
      MarkdownBuilder.buildLastMeasurementMD,
    );
  }
}

class LastEventController extends LastObservationController {
  constructor(telegramBot, iotClient) {
    super(
      telegramBot,
      CallbackDataType.thingLastEvent,
      CallbackDataType.typeLastEvent,
      () => iotClient.thingsService.getThings(undefined, true),
      async thing => {
        try {
          const {
            body: {
              supportedObservationTypes: { event },
            },
          } = await iotClient.thingService.getThingByName(thing);
          return event;
        } catch (err) {
          throw err;
        }
      },
      (thing, type) => iotClient.eventService.getLast(thing, type),
      MarkdownBuilder.buildLastEventMD,
    );
  }
}

export { LastMeasurementController, LastEventController };
