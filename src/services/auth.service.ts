import { OAuth2Client } from "google-auth-library";
import User, { TUser } from "../models/user.model";
import ApiError from "../utils/api-error.utils";

export async function verifyGoogleCredential(credential: string) {
  const client = new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (e: any) {
    console.log(e);

    throw new ApiError({
      message: "Your token is expired try again.",
      statusCode: 400,
      name: "AUTHENTICATION_ERROR",
    });
  }
}

export async function createUserIfNotExist({
  full_name,
  email,
  avatar,
}: {
  full_name: string;
  email: string;
  avatar: string;
}) {
  const user = await User.findOne({ email });

  if (user) {
    return user;
  }

  const newUser: TUser = new User({ full_name, email, avatar });
  return await newUser.save();
}
