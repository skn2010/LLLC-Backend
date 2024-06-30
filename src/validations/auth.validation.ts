import { Schema } from "express-validator";

export const googleLoginSchemaValidator: Schema = {
  credential: {
    in: ["body"],
    isString: {
      errorMessage: "Credential must be a string.",
    },
    notEmpty: {
      errorMessage: "Credential is required",
    },
    trim: true,
  },
};
