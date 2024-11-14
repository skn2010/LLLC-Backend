import { Router } from "express";
import { checkSchema } from "express-validator";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";

import multerConfig from "../middlewares/multer-config.middleware";
import uploadImages from "../middlewares/upload-images.middleware";
import authenticateUser from "../middlewares/authenticate-user.middleware";
import * as validation from "../validations/review.validation";
import * as controller from "../controllers/review.controller";
import validateSchema from "../middlewares/validate-schema.middleware";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  authenticateUser,
  multerConfig(["images"]),
  uploadImages([
    { containerName: "review", fieldName: "images", isRequired: true },
  ]),
  checkSchema(validation.createSchema),
  validateSchema,
  serviceErrorHandler(controller.createReview)
);

reviewRouter.get(
  "/:reviewId",
  checkSchema(validation.getDetailsSchema),
  validateSchema,
  serviceErrorHandler(controller.getReviewDetails)
);

reviewRouter.get(
  "/of-menu/:menuId",
  checkSchema(validation.getMenuReviewSchema),
  validateSchema,
  serviceErrorHandler(controller.getReviewOfMenu)
);

export default reviewRouter;
