import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as authService from "../services/auth.service";
import { generateAccessToken } from "../lib/jwt.lib";

export async function googleLogin(req: Request, res: Response) {
  const sanitizedData = matchedData(req);

  const result: any = await authService.verifyGoogleCredential(
    sanitizedData.credential
  );

  const user = await authService.createUserIfNotExist({
    full_name: result.name,
    email: result.email,
    avatar: result.picture,
  });

  const accessToken = generateAccessToken(user);

  return res.json({
    data: { user, accessToken },
    message: "Login successful.",
  });
}
