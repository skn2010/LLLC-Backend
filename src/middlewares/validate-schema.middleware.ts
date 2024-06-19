import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.utils";

export default function validateSchema(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new ApiError({
      message: JSON.stringify(result.array()),
      statusCode: 422,
      name: "EXPRESS_VALIDATION_ERROR",
    });

    next(error);
  }

  next();
}
