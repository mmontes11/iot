import eventController from "../controllers/rest/eventController";
import validationController from "../controllers/rest/validationController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router
  .route("/")
  .post(validationController.validateCreateEvent, eventController.createEvent)
  .get(validationController.validateCommonParams, validationController.validateGetData, eventController.getData);

router.route("/types").get(eventController.getTypes);

router.route("/last").get(eventController.getLastEvent);

router.route("/stats").get(validationController.validateCommonParams, eventController.getStats);

export default router;
