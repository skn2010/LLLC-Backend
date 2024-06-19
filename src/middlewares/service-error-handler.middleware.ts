import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiError from "../utils/api-error.utils";
import { MongooseError } from "mongoose";

export default function serviceErrorHandler(
  controllerFunction: RequestHandler
): RequestHandler {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await controllerFunction(req, res, next);
    } catch (error) {
      if (error instanceof MongooseError) {
        const errorObj = new ApiError({
          message: JSON.stringify(error),
          statusCode: 400,
          name: "MONGOOSE_ERROR",
        });
        next(errorObj);
      }

      next(error);
    }
  };
}
