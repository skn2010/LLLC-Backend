import { Request, Response, NextFunction, RequestHandler } from "express";
import * as bucket from "../services/backblaze.service";
import ApiError from "../utils/api-error.utils";

export default function uploadImages(
  containerName: string,
  totalNumberOfImage: number
): RequestHandler {
  return async function (req: Request, _res: Response, next: NextFunction) {
    try {
      const filesToBeUploaded: Promise<{ url: string; data: any }>[] = [];

      ((req?.files as Express.Multer.File[]) || []).forEach((item, index) => {
        filesToBeUploaded.push(
          bucket.uploadFile({
            containerName,
            file: item,
            originalname: item.originalname,
          })
        );
      });

      if (!filesToBeUploaded.length) {
        next();
      }

      if (filesToBeUploaded.length > totalNumberOfImage) {
        throw new ApiError({
          message: `You have uploaded more images (${totalNumberOfImage})`,
          name: "VALIDATION_ERROR",
          statusCode: 400,
        });
      }

      const response = await Promise.all(filesToBeUploaded);

      req.uploadedImages = response.map((item) => ({
        url: item.url,
        fileId: item.data.fileId,
        fileName: item.data.fileName,
        container_name: containerName,
      }));

      next();
    } catch (e) {
      console.log(e);

      next(e);
    }
  };
}
