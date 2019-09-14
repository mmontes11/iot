import { SubscriptionModel } from "../../models/subscription";
import responseHandler from "../../helpers/responseHandler";
import responseKeys from "../../utils/responseKeys";

const getSubscriptionsByChat = async ({ query: { chatId: chatIdReq } }, res) => {
  try {
    const chatId = parseInt(chatIdReq, 10);
    const subscriptions = await SubscriptionModel.find({ chatId });
    responseHandler.handleResponse(res, subscriptions, responseKeys.subscriptionsArrayKey);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

export default { getSubscriptionsByChat };
