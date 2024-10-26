import { Request, Response, NextFunction, RequestHandler } from "express";
import * as bucket from "../services/backblaze.service";
import ApiError from "../utils/api-error.utils";

export default function uploadImages(
  containerName: string,
  totalNumberOfImage: number
): RequestHandler {
  return async function (req: Request, _res: Response, next: NextFunction) {
    try {
      
      // Adding promises (async functions) to this attribute to hold all the promises of images uploading fn
      const filesToBeUploaded: Promise<{ url: string; data: any }>[] = [];

      ((req?.files as Express.Multer.File[]) || []).forEach((item) => {
        filesToBeUploaded.push(
          bucket.uploadFile({
            containerName,
            file: item,
            originalname: item.originalname,
          })
        );
      });

      // Pass the controller to the next function when there is nothing to upload any images in the req object
      if (!filesToBeUploaded.length) {
        next();
      }

      // Let's verify if the user send more images than expected
      if (filesToBeUploaded.length > totalNumberOfImage) {
        throw new ApiError({
          message: `You have uploaded more images (${totalNumberOfImage})`,
          name: "VALIDATION_ERROR",
          statusCode: 400,
        });
      }

      // Upload images to the buckets
      const response = await Promise.all(filesToBeUploaded);

      // Attach the uploaded images to request object so that we can use them from other middlewares like controller or error middleware too
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
