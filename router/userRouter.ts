import { Router } from "express";
import {
  changeUserPassword,
  createUser,
  getAllUsers,
  resetUserPassword,
  signinUser,
  verifyUser,
} from "../controller/userController";
import validator from "../utils/validator";
import { passwordValidator, registerValidator } from "../utils/userValidator";
import { authorization } from "../utils/authorization";

const router: Router = Router();
router.route("/register-user").post(validator(registerValidator), createUser);
router.route("/sign-in-user").post(signinUser);

router.route("/all-users").get(authorization, getAllUsers);

router.route("/verify-user").patch(verifyUser);

router.route("/reset-user-password").patch(resetUserPassword);
router
  .route("/change-user-password/:userID")
  .patch(validator(passwordValidator), changeUserPassword);
export default router;
