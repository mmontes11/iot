import validationController from "../controllers/rest/validationController";
import notificationsController from "../controllers/rest/notificationsController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router
  .route("/notifications")
  .post(validationController.validateNotifications, notificationsController.receiveMeasurementChangeNotifications);

export default router;
