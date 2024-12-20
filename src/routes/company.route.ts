import { Router } from "express";
import { checkSchema } from "express-validator";
import validateSchema from "../middlewares/validate-schema.middleware";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";
import authenticateUser from "../middlewares/authenticate-user.middleware";
import uploadImages from "../middlewares/upload-images.middleware";
import multerConfig from "../middlewares/multer-config.middleware";

import * as companySchemaValidation from "../validations/company.validation";
import * as companyController from "../controllers/company.controller";

const companyRouter = Router();

companyRouter.get(
  "/",
  checkSchema(companySchemaValidation.companyListSchemaValidation),
  validateSchema,
  serviceErrorHandler(companyController.getCompanies)
);

companyRouter.get(
  "/popular",
  serviceErrorHandler(companyController.getPopularCompaniesBasedOnReactions)
);

companyRouter.post(
  "/",
  authenticateUser,
  multerConfig(["cover_image"]),
  uploadImages([
    { containerName: "company", fieldName: "cover_image", isRequired: false },
  ]),
  checkSchema(companySchemaValidation.companyCreateSchemaValidation),
  validateSchema,
  serviceErrorHandler(companyController.createCompany)
);

companyRouter.patch(
  "/:companyId",
  authenticateUser,
  multerConfig(["cover_image"]),
  uploadImages([
    { containerName: "company", fieldName: "cover_image", isRequired: false },
  ]),
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
