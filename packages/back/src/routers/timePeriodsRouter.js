import timePeriodsController from "../controllers/rest/timePeriodsController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router.route("/").get(timePeriodsController.getTimePeriods);

export default router;
