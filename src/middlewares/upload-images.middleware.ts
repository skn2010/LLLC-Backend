import { Request, Response, NextFunction, RequestHandler } from "express";
import * as bucket from "../services/backblaze.service";
import { TImage } from "../types";

type Props = {
  containerName: string;
  fieldName: string;
  isRequired: boolean;
};

type FilesToBeUploaded = {
  [key: string]: Promise<{ url: string; data: any }>[];
};

export default function uploadImages(configSettings: Props[]): RequestHandler {
  return async function (req: Request, _res: Response, next: NextFunction) {
    const filesToBeUploaded: FilesToBeUploaded = {};
    const files = req.files as { [field: string]: Express.Multer.File[] };

    for (const configSetting of configSettings) {
      const fieldFiles = files[configSetting.fieldName];

      // Check if required files are missing
      if (!fieldFiles && configSetting.isRequired) {
        return next(
          new Error(
            `Field ${configSetting.fieldName} is required but no files were provided.`
          )
        );
      }

      // Initialize the upload promises for each file
      if (fieldFiles) {
        filesToBeUploaded[configSetting.fieldName] = fieldFiles.map((file) =>
          bucket.uploadFile({
            containerName: configSetting.containerName,
            file,
            originalname: file.originalname,
          })
        );
      }
    }

    try {
      const uploadedImages: {
        [key: string]: TImage[];
      } = {};

      for (const [key, value] of Object.entries(filesToBeUploaded)) {
        const response = await Promise.all(value);

        uploadedImages[key] = response.map((item) => ({
          url: item.url,
          fileId: item.data.fileId,
          fileName: item.data.fileName,
          container_name:
            configSettings.find((item) => item.fieldName === key.toString())
              ?.containerName || "default",
        }));
      }

      req.uploadedImages = uploadedImages;
    } catch (e) {
      console.error(`location: upload-images.middleware, message: ${e}`);
      next(e);
    }

    next();
  };
}
