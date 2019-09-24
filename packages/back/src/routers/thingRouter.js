import thingController from "../controllers/rest/thingController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router.route("/:name").get(thingController.getThingByName);

export default router;
