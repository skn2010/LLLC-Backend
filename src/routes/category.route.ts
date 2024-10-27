import { Router } from "express";
import { checkSchema } from "express-validator";
import validateSchema from "../middlewares/validate-schema.middleware";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";
import authenticateAdmin from "../middlewares/authenticate-admin.middleware";
import uploadImages from "../middlewares/upload-images.middleware";
import multerConfig from "../middlewares/multer-config.middleware";

import * as categorySchemaValidation from "../validations/category.validation";
import * as categoryController from "../controllers/category.controller";

const categoryRouter = Router();

categoryRouter.get(
  "/",
  checkSchema(categorySchemaValidation.categoryListSchemaValidation),
  validateSchema,
  serviceErrorHandler(categoryController.getCategoryList)
);

categoryRouter.get(
  "/dropdown",
  serviceErrorHandler(categoryController.getCategoryDropdown)
);

categoryRouter.get(
  "/:categoryId",
  checkSchema(categorySchemaValidation.singleCategoryGetSchemaValidation),
  validateSchema,
  serviceErrorHandler(categoryController.getSingleCategory)
);

categoryRouter.post(
  "/",
  authenticateAdmin,
  multerConfig(["image"]),
  checkSchema(categorySchemaValidation.categoryCreateSchemaValidation),
  validateSchema,
  uploadImages([
    { containerName: "category", fieldName: "image", isRequired: false },
  ]),
  serviceErrorHandler(categoryController.createCategory)
);

categoryRouter.patch(
  "/:categoryId",
  authenticateAdmin,
  multerConfig(["image"]),
  checkSchema(categorySchemaValidation.categoryUpdateSchemaValidation),
  validateSchema,
  uploadImages([
    { containerName: "category", fieldName: "image", isRequired: false },
  ]),
  serviceErrorHandler(categoryController.updateCategory)
);

categoryRouter.delete(
  "/:categoryId",
  authenticateAdmin,
  checkSchema(categorySchemaValidation.categoryDeleteSchemaValidation),
  validateSchema,
  serviceErrorHandler(categoryController.deleteCategory)
);

export default categoryRouter;
