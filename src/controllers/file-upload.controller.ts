import { Request, Response } from "express";
import { matchedData } from "express-validator";
import ApiError from "../utils/api-error.utils";
import * as backblazeService from "../services/backblaze.service";

const file_types: string[] = ["categories", "posts"];

export async function fileUpload(req: Request, res: Response) {
  if (!req.file) {
    throw new ApiError({ message: "", statusCode: 400, name: "B2_ERROR" });
  }

  // For categorizing media files just like post/ or /category
  const fileType = file_types.includes(req?.body.fileType || "posts")
    ? req?.body?.fileType
    : "posts";

  const fileUploadRes = await backblazeService.uploadFile({
    fileType: fileType || "",
    file: req.file,
    originalname: req.file.originalname,
  });

  return res.json(fileUploadRes);
}

export async function fileDelete(req: Request, res: Response) {
  const body = matchedData(req, { locations: ["body"] });

  const response = await backblazeService.deleteFile({
    fileId: body.fileId,
    fileName: body.fileName,
  });

  return res.json({ data: response, message: "File deleted successfully." });
}
