import { Router } from "express";
import { checkSchema } from "express-validator";
import multerConfig from "../middlewares/multer-config.middleware";
import uploadImages from "../middlewares/upload-images.middleware";
import authenticateUser from "../middlewares/authenticate-user.middleware";

import validateSchema from "../middlewares/validate-schema.middleware";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";
import * as controller from "../controllers/menu.controller";
import * as validation from "../validations/menu.validation";

const menuRouter = Router();

menuRouter.get(
  "/of-company/:companyId",
  checkSchema(validation.menusOfCompanyGetSchema),
  validateSchema,
  serviceErrorHandler(controller.getMenusOfCompany),
);

menuRouter.get(
  "/:menuId",
  checkSchema(validation.menuGetSchema),
  validateSchema,
  serviceErrorHandler(controller.getMenu),
);

menuRouter.get(
  "/of-company/:companyId/dropdown",
  checkSchema(validation.menusDropdownOfCompanyGetSchema),
  validateSchema,
  serviceErrorHandler(controller.getMenusOfCompanyDropdown),
);

menuRouter.post(
  "/",
  authenticateUser,
  multerConfig,
  checkSchema(validation.menuCreateSchema),
  validateSchema,
  uploadImages("menu", 5),
  serviceErrorHandler(controller.createMenu),
);

menuRouter.patch(
  "/:menuId",
  authenticateUser,
  multerConfig,
  checkSchema(validation.menuUpdateSchema),
  validateSchema,
  uploadImages("menu", 5), 
  serviceErrorHandler(controller.updateMenu),
);

menuRouter.delete(
  "/:menuId",
  authenticateUser,
  checkSchema(validation.menuDeleteSchema),
  validateSchema,
  serviceErrorHandler(controller.deleteMenu),
);

export default menuRouter;
