import measurementController from "../controllers/rest/measurementController";
import validationController from "../controllers/rest/validationController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router
  .route("/")
  .post(validationController.validateCreateMeasurement, measurementController.createMeasurement)
  .get(validationController.validateCommonParams, validationController.validateGetData, measurementController.getData);

router.route("/types").get(measurementController.getTypes);

router.route("/last").get(measurementController.getLastMeasurement);

router.route("/stats").get(validationController.validateCommonParams, measurementController.getStats);

export default router;
