import { Schema } from "express-validator";

export const companyCreateSchemaValidation: Schema = {
  name: {
    in: ["body"],
    trim: true,
    isString: {
      errorMessage: "Name must be a string.",
    },
    notEmpty: {
      errorMessage: "Name is required.",
    },
  },

  email: {
    in: ["body"],
    trim: true,
    isEmail: {
      errorMessage: "Invalid email address",
    },
    notEmpty: {
      errorMessage: "Email is required.",
    },
  },

  opening_time: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Opening time is required.",
    },
  },

  closing_time: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Closing time is required.",
    },
  },

  description: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Description is required.",
    },
  },

  contact_number: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Contact number is required.",
    },
  },

  location: {
    in: ["body"],
    custom: {
      options: (value) => {
        if (
          typeof value !== "object" ||
          typeof value.latitude !== "number" ||
          typeof value.longitude !== "number"
        ) {
          throw new Error(
            "Location must be an object containing latitude and longitude as numbers."
          );
        }
        if (value.latitude < -90 || value.latitude > 90) {
          throw new Error("Latitude must be between -90 and 90.");
        }
        if (value.longitude < -180 || value.longitude > 180) {
          throw new Error("Longitude must be between -180 and 180.");
        }
        return true;
      },
    },
    notEmpty: {
      errorMessage: "Location is required.",
    },
  },

  category: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Name must be a string.",
    },
  },
};

export const companyUpdateSchemaValidation: Schema = {
  companyId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Company ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },

  name: {
    in: ["body"],
    trim: true,
    isString: {
      errorMessage: "Name must be a string.",
    },
    optional: true,
  },

  email: {
    in: ["body"],
    trim: true,
    isEmail: {
      errorMessage: "Invalid email address",
    },
    optional: true,
  },

  opening_time: {
    in: ["body"],
    trim: true,
    optional: true,
  },

  closing_time: {
    in: ["body"],
    trim: true,
    optional: true,
  },

  description: {
    in: ["body"],
    trim: true,
    optional: true,
  },

  contact_number: {
    in: ["body"],
    trim: true,
    optional: true,
  },

  location: {
    in: ["body"],
    custom: {
      options: (value) => {
        if (
          typeof value.latitude !== "string" ||
          typeof value.longitude !== "string"
        ) {
          throw new Error(
            "Location must contain latitude and longitude as strings."
          );
        }
        return true;
      },
    },
    optional: true,
  },

  image: {
    in: ["body"],
    optional: true,
    custom: {
      options: (value) => {
        if (!value || typeof value !== "object") {
          throw new Error(
            "Image must have url, fileId, fileName, and contentType fields."
          );
        }

        if (
          !value?.url?.trim() ||
          !value?.fileId?.trim() ||
          !value?.fileName?.trim() ||
          !value?.contentType?.trim()
        ) {
          throw new Error(
            "Image must have url, fileId, fileName, and contentType fields."
          );
        }

        return true;
      },
    },
  },
};

export const companyDeleteSchemaValidation: Schema = {
  companyId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Company ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },
};

export const companyDetailsGetSchemaValidation: Schema = {
  companyId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Company ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },
};
