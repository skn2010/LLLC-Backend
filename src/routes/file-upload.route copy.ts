import { Router } from "express";
import { checkSchema } from "express-validator";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";
import multerConfig from "../middlewares/multer-config.middleware";
import validateSchema from "../middlewares/validate-schema.middleware";
import authenticateAdmin from "../middlewares/authenticate-admin.middleware";
import * as fileUploadSchemaValidation from "../validations/file-manage.validation";
import * as fileController from "../controllers/file-upload.controller";

const fileUploadRoute = Router();

fileUploadRoute.post(
  "/upload",
  multerConfig.single("file"),
  authenticateAdmin,
  serviceErrorHandler(fileController.fileUpload)
);

fileUploadRoute.post(
  "/delete",
  authenticateAdmin,
  checkSchema(fileUploadSchemaValidation.fileDeleteSchemaValidation),
  validateSchema,
  serviceErrorHandler(fileController.fileDelete)
);

export default fileUploadRoute;
