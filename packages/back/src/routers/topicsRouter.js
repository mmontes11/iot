import topicsController from "../controllers/rest/topicsController";
import { getRouterWithJwtAuth } from "../helpers/router";

const router = getRouterWithJwtAuth();

router.route("/").get(topicsController.getTopics);

export default router;
