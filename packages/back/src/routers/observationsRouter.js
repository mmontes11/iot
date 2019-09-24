import validationController from "../controllers/rest/validationController";
import observationsController from "../controllers/rest/observationsController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router.route("/").post(validationController.validateCreateObservations, observationsController.createObservations);

export default router;
