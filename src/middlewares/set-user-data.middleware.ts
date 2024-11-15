import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import verifyAccessToken from "../lib/jwt.lib";
import { getUser } from "../services/user.service";

export default async function setUserData(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization") || "";

  if (!token || !token.trim()) {
    return next();
  }

  try {
    const verifiedUserToken = verifyAccessToken(token.split(" ")[1] || token);

    const userInfo = await getUser(
      verifiedUserToken._doc._id as mongoose.Types.ObjectId
    );
    req.user = userInfo;

    next();
  } catch (e) {
    next(e);
  }
}
