import validationController from "../controllers/rest/validationController";
import subscriptionController from "../controllers/rest/subscriptionController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router.route("/").post(validationController.validateCreateSubscription, subscriptionController.createSubscription);

router.route("/:id").delete(validationController.validateDeleteSubscription, subscriptionController.deleteSubscription);

export default router;
