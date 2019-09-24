import validationController from "../controllers/rest/validationController";
import thingController from "../controllers/rest/thingController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router.route("/").get(validationController.validateGetThings, thingController.getThings);

export default router;
