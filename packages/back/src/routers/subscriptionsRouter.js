import validationController from "../controllers/rest/validationController";
import subscriptionsController from "../controllers/rest/subscriptionsController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router
  .route("/")
  .get(validationController.validateGetSubscriptionsByChat, subscriptionsController.getSubscriptionsByChat);

export default router;
