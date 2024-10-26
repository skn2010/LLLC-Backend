import multer from "multer";

const storage = multer.memoryStorage();

const multerConfig = (fieldNames = ["images"]) => {
  const fields = fieldNames.map((name) => ({ name }));

  return multer({
    storage,
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        console.error(
          "location: multer-config.middleware, message: Invalid file type. Only images are allowed."
        );
        cb(null, false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  }).fields(fields);
};

export default multerConfig;
