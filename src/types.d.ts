import { TUser } from "./models/user.model";

declare module "express" {
  interface Request {
    user?: TUser;
  }
}
