import jwt from "jsonwebtoken";
import { TUser } from "../models/user.model";
import ApiError from "../utils/api-error.utils";

export function generateAccessToken(user: TUser) {
  const secretKey = process.env.JTW_SECRET_KEY || "secret_key";

  const accessToken = jwt.sign({ ...user }, secretKey, {
    expiresIn: "30d",
  });

  return accessToken;
}

export default function verifyAccessToken(token: string) {
  if (!token.trim()) {
    throw new ApiError({
      message: "Invalid access token.",
      statusCode: 400,
      name: "AUTHORIZATION_ERROR",
    });
  }

  try {
    const secretKey = process.env.JTW_SECRET_KEY || "secret_key";
    return jwt.verify(token, secretKey) as {
      _doc: TUser;
      [key: string]: unknown;
    };
  } catch {
    throw new ApiError({
      message: "Your access token is expired please login again.",
      statusCode: 400,
      name: "TOKEN_EXPIRATION_ERROR",
    });
  }
}
