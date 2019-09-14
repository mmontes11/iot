import _ from "underscore";
import { StatsParams } from "../../models/statsParams";
import { MarkdownBuilder } from "../../helpers/markdownBuilder";
import { ErrorHandler } from "../../helpers/errorHandler";
import { CallbackData, CallbackDataType } from "../../models/callbackData";
import { TelegramInlineKeyboardHelper } from "../../helpers/telegramInlineKeyboardHelper";
import messages from "../../utils/messages";

class ObservationStatsController {
  constructor(
    telegramBot,
    iotClient,
    thingCallbackDataType,
    timePeriodCallbackDataType,
    getThings,
    getStats,
    getMarkdown,
  ) {
    this.bot = telegramBot;
    this.errorHandler = new ErrorHandler(telegramBot);
    this.iotClient = iotClient;
    this.thingCallbackDataType = thingCallbackDataType;
    this.timePeriodCallbackDataType = timePeriodCallbackDataType;
    this.supportedCallbackDataTypes = [this.thingCallbackDataType, this.timePeriodCallbackDataType];
    this.getThings = getThings;
    this.getStats = getStats;
    this.getMarkdown = getMarkdown;
    this.statsParamsByChat = [];
  }
  handleStatsCommand(msg) {
    const chatId = msg.chat.id;
    this._start(chatId);
  }
  canHandleCallbackData(callbackData) {
    return _.contains(this.supportedCallbackDataTypes, callbackData.type);
  }
  handleCallbackQuery(callbackQuery, callbackData) {
    const chatId = callbackQuery.message.chat.id;
    const statsParams = this._getOrCreateMeasurementStatsParams(chatId);
    const answerCallbackQuery = () => this.bot.answerCallbackQuery(callbackQuery.id);
    const reset = () => {
      answerCallbackQuery();
      this._start(chatId);
    };
    switch (callbackData.type) {
      case this.thingCallbackDataType: {
        if (_.isUndefined(statsParams.thing)) {
          statsParams.setThing(callbackData.data);
          this._selectTimePeriod(chatId, answerCallbackQuery);
        } else {
          reset();
        }
        break;
      }
      case this.timePeriodCallbackDataType: {
        if (!_.isUndefined(statsParams.thing) && _.isUndefined(statsParams.type)) {
          statsParams.setTimePeriod(callbackData.data);
          this._deleteMeasurementStatsParams(chatId);
          this._showMeasurementStats(chatId, statsParams, answerCallbackQuery);
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
    this._deleteMeasurementStatsParams(chatId);
    this._selectThings(chatId);
  }
  async _selectThings(chatId) {
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
  async _selectTimePeriod(chatId, answerCallbackQuery) {
    try {
      const {
        body: { timePeriods },
      } = await this.iotClient.timePeriodsService.getSupportedTimePeriods();
      const inlineKeyboardButtons = _.map(timePeriods, timePeriod => {
        const callbackData = new CallbackData(this.timePeriodCallbackDataType, timePeriod);
        return {
          text: timePeriod,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      answerCallbackQuery();
      this.bot.sendMessage(chatId, messages.timePeriodSelectMessage, options);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleTimePeriodsError(err, chatId);
    }
  }
  async _showMeasurementStats(chatId, statsParams, answerCallbackQuery) {
    try {
      const {
        body: { stats },
      } = await this.getStats(statsParams.toJSON());
      const markdown = this.getMarkdown(statsParams, stats);
      const options = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      };
      answerCallbackQuery();
      this.bot.sendMessage(chatId, markdown, options);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleStatsError(err, chatId);
    }
  }
  _deleteMeasurementStatsParams(chatId) {
    const statsParamsIndex = _.findIndex(this.statsParamsByChat, statsParams => statsParams.chatId === chatId);
    if (statsParamsIndex !== -1) {
      this.statsParamsByChat.splice(statsParamsIndex, 1);
    }
  }
  _getOrCreateMeasurementStatsParams(chatId) {
    let statsParams = _.find(this.statsParamsByChat, params => params.chatId === chatId);
    if (_.isUndefined(statsParams)) {
      statsParams = new StatsParams(chatId);
      this.statsParamsByChat.push(statsParams);
      return statsParams;
    }
    return statsParams;
  }
}

class MeasurementStatsController extends ObservationStatsController {
  constructor(telegramBot, iotClient) {
    super(
      telegramBot,
      iotClient,
      CallbackDataType.thingMeasurement,
      CallbackDataType.timePeriodMeasurement,
      () => iotClient.thingsService.getThings(true, undefined),
      statsParams => iotClient.measurementService.getStats(statsParams),
      MarkdownBuilder.buildMeasurementStatsListMD,
    );
  }
}

class EventStatsController extends ObservationStatsController {
  constructor(telegramBot, iotClient) {
    super(
      telegramBot,
      iotClient,
      CallbackDataType.thingEvent,
      CallbackDataType.timePeriodEvent,
      () => iotClient.thingsService.getThings(undefined, true),
      statsParams => iotClient.eventService.getStats(statsParams),
      MarkdownBuilder.buildEventStatsListMD,
    );
  }
}

export { MeasurementStatsController, EventStatsController };
