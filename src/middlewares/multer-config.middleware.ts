import { Request } from "express";
import multer from "multer";

const allowedFileTypes = ["image", "video", "audio"];
const storage = multer.memoryStorage();

const multerConfig = multer({
  storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const fileType = file.mimetype.split("/")[0]; // Extract the file type from the MIME type

    if (allowedFileTypes.includes(fileType)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed types: image, video, audio."));
    }
  },
});

export default multerConfig;
