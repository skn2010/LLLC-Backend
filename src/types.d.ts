import { TUser } from "./models/user.model";

declare module "express" {
  interface Request {
    user?: TUser;
    uploadedImages?: {
      [key: string]: TImage[];
    };
  }
}

type TImage = {
  url: string;
  fileId: string;
  fileName: string;
  container_name: string;
};
