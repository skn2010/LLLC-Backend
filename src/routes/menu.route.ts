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
  serviceErrorHandler(controller.getMenusOfCompany)
);

menuRouter.get(
  "/popular/of-company/:companyId",
  checkSchema(validation.popularMenusOfCompanyGetSchema),
  validateSchema,
  serviceErrorHandler(controller.getPopularMenusOfCompany)
);

menuRouter.get(
  "/:menuId",
  checkSchema(validation.menuGetSchema),
  validateSchema,
  serviceErrorHandler(controller.getMenu)
);

menuRouter.get(
  "/of-company/:companyId/dropdown",
  checkSchema(validation.menusDropdownOfCompanyGetSchema),
  validateSchema,
  serviceErrorHandler(controller.getMenusOfCompanyDropdown)
);

menuRouter.post(
  "/",
  authenticateUser,
  multerConfig(["images"]),
  uploadImages([
    { containerName: "menu", fieldName: "images", isRequired: true },
  ]),
  checkSchema(validation.menuCreateSchema),
  validateSchema,
  serviceErrorHandler(controller.createMenu)
);

menuRouter.patch(
  "/:menuId",
  authenticateUser,
  multerConfig(["images"]),
  uploadImages([
    { containerName: "menu", fieldName: "images", isRequired: false },
  ]),
  checkSchema(validation.menuUpdateSchema),
  validateSchema,
  serviceErrorHandler(controller.updateMenu)
);

menuRouter.delete(
  "/:menuId",
  authenticateUser,
  checkSchema(validation.menuDeleteSchema),
  validateSchema,
  serviceErrorHandler(controller.deleteMenu)
);

export default menuRouter;
