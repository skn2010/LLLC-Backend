import { Router } from "express";
import { checkSchema } from "express-validator";
import validateSchema from "../middlewares/validate-schema.middleware";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";
import authenticateUser from "../middlewares/authenticate-user.middleware";
import * as companySchemaValidation from "../validations/company.validation";
import * as companyController from "../controllers/company.controller";

const companyRouter = Router();

companyRouter.post(
  "/",
  authenticateUser,
  checkSchema(companySchemaValidation.companyCreateSchemaValidation),
  validateSchema,
  serviceErrorHandler(companyController.createCompany)
);

companyRouter.patch(
  "/:companyId",
  authenticateUser,
  checkSchema(companySchemaValidation.companyUpdateSchemaValidation),
  validateSchema,
  serviceErrorHandler(companyController.updateCompany)
);

companyRouter.delete(
  "/:companyId",
  authenticateUser,
  checkSchema(companySchemaValidation.companyDeleteSchemaValidation),
  validateSchema,
  serviceErrorHandler(companyController.deleteCompany)
);

companyRouter.get(
  "/of-user",
  authenticateUser,
  serviceErrorHandler(companyController.getUsersCompanyList)
);

companyRouter.get(
  "/dropdown",
  serviceErrorHandler(companyController.getCompanyDropdown)
);

companyRouter.get(
  "/:companyId",
  checkSchema(companySchemaValidation.companyDetailsGetSchemaValidation),
  validateSchema,
  serviceErrorHandler(companyController.getCompanyDetails)
);

export default companyRouter;
