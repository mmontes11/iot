import _ from "underscore";
import httpStatus from "http-status";
import { SubscriptionModel } from "../../models/subscription";
import { TopicModel } from "../../models/topic";
import modelFactory from "../../helpers/modelFactory";
import responseHandler from "../../helpers/responseHandler";

const createSubscription = async (req, res) => {
  try {
    const subscription = req.body;
    if (_.isUndefined(subscription.topic) && !_.isUndefined(subscription.topicId)) {
      const topic = await TopicModel.findTopicById(subscription.topicId);
      if (_.isNull(topic)) {
        return res.status(httpStatus.NOT_FOUND).json({ topicId: subscription.topicId });
      }
      subscription.topic = topic.topic;
    }
    const foundSubscription = await SubscriptionModel.findSubscription(subscription);
    if (_.isNull(foundSubscription)) {
      const newSubscription = modelFactory.createSubscription(subscription);
      const savedSubscription = await newSubscription.save();
      return res.status(httpStatus.CREATED).json(savedSubscription);
    }
    return res.status(httpStatus.CONFLICT).json(foundSubscription);
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
};

const deleteSubscription = async (req, res) => {
  const subscriptionId = req.params.id;
  try {
    const foundSubscription = await SubscriptionModel.findSubscriptionById(subscriptionId);
    if (!_.isNull(foundSubscription)) {
      await foundSubscription.remove();
      res.sendStatus(httpStatus.OK);
    } else {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

export default { createSubscription, deleteSubscription };
