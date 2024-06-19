import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error.utils";

const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
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
