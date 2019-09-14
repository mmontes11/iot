import _ from "underscore";
import { SubscriptionParams } from "../../models/subscriptionParams";
import { CallbackData, CallbackDataType } from "../../models/callbackData";
import { TopicType, availableTopicTypes } from "../../models/topicType";
import { ResponseHandler } from "../../helpers/responseHandler";
import { ErrorHandler } from "../../helpers/errorHandler";
import { TelegramInlineKeyboardHelper } from "../../helpers/telegramInlineKeyboardHelper";
import messages from "../../utils/messages";
import { MarkdownBuilder } from "../../helpers/markdownBuilder";

export class SubscriptionsController {
  constructor(telegramBot, iotClient) {
    this.bot = telegramBot;
    this.iotClient = iotClient;
    this.subscribeCallbackDataTypes = [CallbackDataType.topicType, CallbackDataType.existingTopic];
    this.unsubscribeCallbackDataTypes = [CallbackDataType.subscription];
    this.supportedCallbackDataTypes = [...this.subscribeCallbackDataTypes, ...this.unsubscribeCallbackDataTypes];
    this.subscriptionParamsByChat = [];
    this.responseHandler = new ResponseHandler(telegramBot);
    this.errorHandler = new ErrorHandler(telegramBot);
  }
  handleSubscribeCommand(msg) {
    const chatId = msg.chat.id;
    this._startSubscribe(chatId);
  }
  handleUnsubscribeCommand(msg) {
    const chatId = msg.chat.id;
    this._startUnsubscribe(chatId);
  }
  handleMySubscriptionsCommand(msg) {
    const chatId = msg.chat.id;
    this._startMySubscriptions(chatId);
  }
  canHandleCallbackData(callbackData) {
    return _.contains(this.supportedCallbackDataTypes, callbackData.type);
  }
  handleCallbackQuery(callbackQuery, callbackData) {
    if (_.contains(this.subscribeCallbackDataTypes, callbackData.type)) {
      this._handleSubscribeCallbackQuery(callbackQuery, callbackData);
    } else if (_.contains(this.unsubscribeCallbackDataTypes, callbackData.type)) {
      this._handleUnsubscribeCallbackQuery(callbackQuery, callbackData);
    }
  }
  shouldHandleCustomTopicSubscription(msg) {
    const chatId = msg.chat.id;
    const subscriptionParams = this._getSubscriptionParams(chatId);
    return (
      !_.isUndefined(subscriptionParams) &&
      !_.isUndefined(subscriptionParams.chatId) &&
      !_.isUndefined(subscriptionParams.topicType) &&
      _.isEqual(subscriptionParams.topicType, TopicType.custom)
    );
  }
  handleCustomTopicSubscription(msg) {
    const chatId = msg.chat.id;
    const subscriptionParams = this._getSubscriptionParams(chatId);
    if (_.isUndefined(subscriptionParams.topic)) {
      const topic = msg.text;
      subscriptionParams.setTopic(topic);
      this._createSubscription(chatId, subscriptionParams);
    } else {
      this._startSubscribe(chatId);
    }
  }
  resetCustomTopicSubscription(msg) {
    const chatId = msg.chat.id;
    this._deleteSubscriptionParams(chatId);
  }
  _startSubscribe(chatId) {
    this._deleteSubscriptionParams(chatId);
    this._selectTopicType(chatId);
  }
  _reset(callbackQuery) {
    const {
      id: callbackQueryId,
      message: {
        chat: { id: chatId },
      },
    } = callbackQuery;
    this.bot.answerCallbackQuery(callbackQueryId);
    this._startSubscribe(chatId);
  }
  async _startUnsubscribe(chatId) {
    try {
      const {
        body: { subscriptions },
      } = await this.iotClient.subscriptionsService.getSubscriptionsByChat(chatId);
      const inlineKeyboardButtons = _.map(subscriptions, subscription => {
        const callbackData = new CallbackData(CallbackDataType.subscription, subscription._id);
        return {
          text: subscription.topic,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      this.bot.sendMessage(chatId, messages.subscriptionSelectMessage, options);
    } catch (err) {
      this.errorHandler.handleGetSubscriptionsError(err, chatId);
    }
  }
  async _startMySubscriptions(chatId) {
    try {
      const {
        body: { subscriptions },
      } = await this.iotClient.subscriptionsService.getSubscriptionsByChat(chatId);
      const markdown = MarkdownBuilder.buildSubscriptionsMD(subscriptions);
      const options = {
        parse_mode: "Markdown",
      };
      this.bot.sendMessage(chatId, markdown, options);
    } catch (err) {
      this.errorHandler.handleGetSubscriptionsError(err, chatId);
    }
  }
  async _handleSubscribeCallbackQuery(callbackQuery, callbackData) {
    const chatId = callbackQuery.message.chat.id;
    const subscriptionParams = this._getOrCreateSubscriptionParams(chatId);
    const answerCallbackQuery = () => this.bot.answerCallbackQuery(callbackQuery.id);
    switch (callbackData.type) {
      case CallbackDataType.topicType: {
        if (_.isUndefined(subscriptionParams.topicType)) {
          subscriptionParams.setTopicType(callbackData.data);
          switch (subscriptionParams.topicType) {
            case TopicType.existing: {
              this._selectExistingTopic(chatId, answerCallbackQuery);
              break;
            }
            case TopicType.custom: {
              this._selectCustomTopic(chatId, answerCallbackQuery);
              break;
            }
            default: {
              this._reset(callbackQuery);
            }
          }
        } else {
          this._reset(callbackQuery);
        }
        break;
      }
      case CallbackDataType.existingTopic: {
        if (_.isUndefined(subscriptionParams.topicId)) {
          subscriptionParams.setTopicId(callbackData.data);
          this._createSubscription(chatId, subscriptionParams, answerCallbackQuery);
        } else {
          this._reset(callbackQuery);
        }
        break;
      }
      default: {
        this._reset(callbackQuery);
      }
    }
  }
  _handleUnsubscribeCallbackQuery(callbackQuery, callbackData) {
    const chatId = callbackQuery.message.chat.id;
    const answerCallbackQuery = () => this.bot.answerCallbackQuery(callbackQuery.id);
    if (callbackData.type === CallbackDataType.subscription) {
      this._deleteSubscription(chatId, callbackData.data, answerCallbackQuery);
    }
  }
  _selectTopicType(chatId) {
    try {
      const inlineKeyboardButtons = _.map(availableTopicTypes, topicType => {
        const callbackData = new CallbackData(CallbackDataType.topicType, topicType);
        return {
          text: topicType,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      this.bot.sendMessage(chatId, messages.topicTypeSelectMessage, options);
    } catch (err) {
      this.errorHandler.handleError(err, chatId);
    }
  }
  async _selectExistingTopic(chatId, answerCallbackQuery) {
    try {
      let res;
      try {
        res = await this.iotClient.topicsService.getTopics();
      } catch (err) {
        this._deleteSubscriptionParams(chatId);
        return this.errorHandler.handleGetTopicsError(err, chatId);
      }
      const inlineKeyboardButtons = _.map(res.body.topics, topicObject => {
        const callbackData = new CallbackData(CallbackDataType.existingTopic, topicObject._id);
        return {
          text: topicObject.topic,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      answerCallbackQuery();
      return this.bot.sendMessage(chatId, messages.topicSelectMessage, options);
    } catch (err) {
      answerCallbackQuery();
      return this.errorHandler.handleError(err, chatId);
    }
  }
  async _selectCustomTopic(chatId, answerCallbackQuery) {
    try {
      let topics;
      try {
        const res = await this.iotClient.topicsService.getTopics();
        topics = _.map(res.body.topics, topicObject => topicObject.topic);
      } catch (err) {
        topics = [];
      }
      const markdown = MarkdownBuilder.buildCustomTopicSubscriptionMD(topics);
      const options = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      };
      answerCallbackQuery();
      this.bot.sendMessage(chatId, markdown, options);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleError(err, chatId);
    }
  }
  async _createSubscription(chatId, subscriptionParams, answerCallbackQuery) {
    try {
      const subscription = subscriptionParams.toJSON();
      const res = await this.iotClient.subscriptionService.subscribe(subscription);
      if (!_.isUndefined(answerCallbackQuery)) {
        answerCallbackQuery();
      }
      await this.responseHandler.handleCreateSubscriptionResponse(res, chatId);
    } catch (err) {
      if (!_.isUndefined(answerCallbackQuery)) {
        answerCallbackQuery();
      }
      await this.errorHandler.handleCreateSubscriptionError(err, chatId);
    }
  }
  async _deleteSubscription(chatId, subscriptionId, answerCallbackQuery) {
    try {
      await this.iotClient.subscriptionService.unSubscribe(subscriptionId);
      answerCallbackQuery();
      this.bot.sendMessage(chatId, messages.subscriptionDeletedMessage);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleDeleteSubscriptionError(err, chatId);
    }
  }
  _deleteSubscriptionParams(chatId) {
    const subscriptionParamsIndex = _.findIndex(
      this.subscriptionParamsByChat,
      subscriptionParams => subscriptionParams.chatId === chatId,
    );
    if (subscriptionParamsIndex !== -1) {
      this.subscriptionParamsByChat.splice(subscriptionParamsIndex, 1);
    }
  }
  _getSubscriptionParams(chatId) {
    return _.find(this.subscriptionParamsByChat, subscriptionParams => subscriptionParams.chatId === chatId);
  }
  _getOrCreateSubscriptionParams(chatId) {
    let subscriptionParams = this._getSubscriptionParams(chatId);
    if (_.isUndefined(subscriptionParams)) {
      subscriptionParams = new SubscriptionParams(chatId);
      this.subscriptionParamsByChat.push(subscriptionParams);
      return subscriptionParams;
    }
    return subscriptionParams;
  }
}
