import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error.utils";
import * as bucket from "../services/backblaze.service";

const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  /* 
  If user's send images and our code/program uploads them in the bucket and later encounter error,
  we have to delete these images from the bucket too.
  */

  try {
    if (req.uploadedImages) {
      const imagesToBeDeleted: Promise<{ url: string; data: any }>[] = [];

      for (const [key, value] of Object.entries(req.uploadedImages)) {
        value.forEach((imageObject) => {
          bucket.deleteFile({
            fileId: imageObject.fileId,
            fileName: imageObject.fileName,
          });
        });

        Promise.all(imagesToBeDeleted);
      }
    }
  } catch (e) {
    console.error(
      "location: error-handler.middleware, message: error while deleting images"
    );
    console.error(e);
  }

  // Express validator errors
  if (err?.name === "EXPRESS_VALIDATION_ERROR") {
    try {
      return res.status(err.statusCode).json({
        status: "error",
        message: JSON.parse(err.message)[0]?.msg || "Validation error.",
        field: JSON.parse(err.message)[0]?.field || undefined,
        stack: err,
      });
    } catch {
      return res.status(err.statusCode).json({
        status: "error",
        message: err?.message || "Validation error.",
        field: undefined,
        stack: err,
      });
    }
  }

  // Mongoose (database ORM) errors
  if (err?.name === "MONGOOSE_ERROR") {
    try {
      const data = JSON.parse(err.message);
      const keys = Object.keys(data?.errors || {});

      if (keys.length) {
        return res.status(err.statusCode).json({
          status: "error",
          message: data?.errors[keys[0]]?.message || "Service error.",
          field: keys[0] || undefined,
          stack: err,
        });
      }

      return res.status(err.statusCode).json({
        status: "error",
        message: err?.message || "Service error.",
        field: undefined,
        stack: err,
      });
    } catch {
      return res.status(err.statusCode).json({
        status: "error",
        message: err?.message || "Service error.",
        field: undefined,
        stack: err,
      });
    }
  }

  // Default Error
  return res.status(err.statusCode || 500).json({
    status: "error",
    message: err?.message || "Internal server error.",
    stack: err,
  });
};

export default errorHandler;
