import { Router } from "express";
import { checkSchema } from "express-validator";
import * as userController from "../controllers/user.controller";
import validateSchema from "../middlewares/validate-schema.middleware";
import authenticateAdmin from "../middlewares/authenticate-admin.middleware";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";
import authenticateUser from "../middlewares/authenticate-user.middleware";
import * as userValidator from "../validations/user.validation";

const userRoute = Router();

userRoute.get(
  "/",
  authenticateAdmin,
  checkSchema(userValidator.userListSchemaValidation),
  validateSchema,
  serviceErrorHandler(userController.getUserList)
);

userRoute.get(
  "/:userId",
  authenticateUser,
  checkSchema(userValidator.singleSchemaValidation),
  validateSchema,
  serviceErrorHandler(userController.getSingleUser)
);

userRoute.get(
  "/:userId/statistics",
  authenticateUser,
  checkSchema(userValidator.userStatisticsSchemaValidation),
  validateSchema,
  serviceErrorHandler(userController.getUserStatistics)
);

userRoute.patch(
  "/:userId",
  authenticateUser,
  checkSchema(userValidator.userUpdateSchemaValidation),
  validateSchema,
  serviceErrorHandler(userController.updateUser)
);

// Check both routes below.. not tested.....

userRoute.delete(
  "/:userId",
  authenticateUser,
  checkSchema(userValidator.userDeleteSchemaValidation),
  validateSchema,
  serviceErrorHandler(userController.deleteUser)
);

userRoute.delete(
  "/:userId/delete-permanently",
  authenticateAdmin,
  checkSchema(userValidator.userDeleteSchemaValidation),
  validateSchema,
  serviceErrorHandler(userController.deleteUserPermanently)
);

export default userRoute;
