import multer from "multer";

// Configure multer storage
const storage = multer.memoryStorage();

const multerConfig = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).array("images", 5); // Field name should match with form-data, max 20 files

export default multerConfig;
