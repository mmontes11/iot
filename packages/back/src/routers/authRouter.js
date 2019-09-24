import authController from "../controllers/rest/authController";
import validationController from "../controllers/rest/validationController";
import { getRouterWithBasicAuth } from "../helpers/router";

const router = getRouterWithBasicAuth();

router.route("/").post(validationController.validateCheckAuth, authController.checkAuth);

router.route("/user").post(validationController.validateCreateUserIfNotExists, authController.createUserIfNotExists);

router.route("/token").post(authController.getToken);

export default router;
