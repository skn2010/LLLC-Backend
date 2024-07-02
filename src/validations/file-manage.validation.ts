import { Schema } from "express-validator";

export const fileDeleteSchemaValidation: Schema = {
  fileId: {
    in: ["body"],
    trim: true,
    isString: {
      errorMessage: "Invalid file id.",
    },
  },

  fileName: {
    in: ["body"],
    trim: true,
    isString: {
      errorMessage: "Invalid filename.",
    },
  },
};
