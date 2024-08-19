import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import verifyAccessToken from "../lib/jwt.lib";
import ApiError from "../utils/api-error.utils";
import { getUser } from "../services/user.service";

export default async function authenticateAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization") || "";

  if (!token || !token.trim()) {
    const error = new ApiError({
      message: "You need to login for this operation.",
      statusCode: 401,
      name: "AUTHENTICATION_ERROR",
    });

    next(error);
  }

  try {
    const verifiedUserToken = verifyAccessToken(token.split(" ")[1] || token);
    const userInfo = await getUser(
      verifiedUserToken._doc._id as mongoose.Types.ObjectId
    );

    if (!userInfo.is_admin) {
      const error = new ApiError({
        message: "You are not authorized to perform this action.",
        statusCode: 401,
        name: "AUTHENTICATION_ERROR",
      });

      next(error);
    }

    req.user = userInfo;

    next();
  } catch (e) {
    next(e);
  }
}
