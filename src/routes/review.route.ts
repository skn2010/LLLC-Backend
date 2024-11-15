import { Router } from "express";
import { checkSchema } from "express-validator";
import serviceErrorHandler from "../middlewares/service-error-handler.middleware";

import multerConfig from "../middlewares/multer-config.middleware";
import uploadImages from "../middlewares/upload-images.middleware";
import authenticateUser from "../middlewares/authenticate-user.middleware";
import * as validation from "../validations/review.validation";
import * as controller from "../controllers/review.controller";
import validateSchema from "../middlewares/validate-schema.middleware";
import setUserData from "../middlewares/set-user-data.middleware";

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
  setUserData,
  checkSchema(validation.getDetailsSchema),
  validateSchema,
  serviceErrorHandler(controller.getReviewDetails)
);

reviewRouter.get(
  "/of-menu/:menuId",
  setUserData,
  checkSchema(validation.getMenuReviewSchema),
  validateSchema,
  serviceErrorHandler(controller.getReviewOfMenu)
);

reviewRouter.get(
  "/of-company/:companyId",
  setUserData,
  checkSchema(validation.getCompanyMenuReviewSchema),
  validateSchema,
  serviceErrorHandler(controller.getReviewsOfCompany)
);

reviewRouter.delete(
  "/:reviewId",
  authenticateUser,
  checkSchema(validation.deleteReviewSchema),
  validateSchema,
  serviceErrorHandler(controller.deleteReview)
);

reviewRouter.post(
  "/:reviewId/reactions",
  authenticateUser,
  checkSchema(validation.addReactionSchema),
  validateSchema,
  serviceErrorHandler(controller.reactOnReview)
);

reviewRouter.delete(
  "/:reviewId/reactions",
  authenticateUser,
  checkSchema(validation.removeReactionSchema),
  validateSchema,
  serviceErrorHandler(controller.removeReactOnReview)
);

export default reviewRouter;
