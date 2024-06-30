import { Router } from "express";
import { checkSchema } from "express-validator";
import validateSchema from "../middlewares/validate-schema.middleware";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";
import * as authValidator from "../validations/auth.validation";
import * as authController from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post(
  "/google-login",
  checkSchema(authValidator.googleLoginSchemaValidator),
  validateSchema,
  serviceErrorHandler(authController.googleLogin)
);

export default authRoute;
