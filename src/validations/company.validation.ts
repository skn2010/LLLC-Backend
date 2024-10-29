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
    customSanitizer: {
      options: (value) => {
        // Parse the JSON string into an object
        try {
          return JSON.parse(value);
        } catch (e) {
          throw new Error("Location must be a valid JSON object");
        }
      },
    },
    custom: {
      options: (value) => {
        if (
          typeof value !== "object" ||
          Number.isNaN(value.latitude) ||
          Number.isNaN(value.longitude)
        ) {
          throw new Error(
            "Location must be an object containing latitude and longitude as numbers."
          );
        }
        if (Number(value.latitude) < -90 || Number(value.latitude) > 90) {
          throw new Error("Latitude must be between -90 and 90.");
        }
        if (Number(value.longitude) < -180 || Number(value.longitude) > 180) {
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

  cover_image: {
    in: ["body"],
    customSanitizer: {
      options: (_value, { req }) => {
        const imageList = req?.uploadedImages?.cover_image || [];

        if (imageList.length > 1) {
          throw new Error(
            "You are not allowed to add more than 1 image for the company."
          );
        }

        return imageList[0];
      },
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
    customSanitizer: {
      options: (value) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          throw new Error("Location must be a valid JSON object");
        }
      },
    },
    custom: {
      options: (value) => {
        if (
          typeof value !== "object" ||
          Number.isNaN(value.latitude) ||
          Number.isNaN(value.longitude)
        ) {
          throw new Error(
            "Location must be an object containing latitude and longitude as numbers."
          );
        }
        if (Number(value.latitude) < -90 || Number(value.latitude) > 90) {
          throw new Error("Latitude must be between -90 and 90.");
        }
        if (Number(value.longitude) < -180 || Number(value.longitude) > 180) {
          throw new Error("Longitude must be between -180 and 180.");
        }
        return true;
      },
    },
    optional: true,
  },

  cover_image: {
    in: ["body"],
    customSanitizer: {
      options: (value, { req }) => {
        const imageList = req?.uploadedImages?.cover_image || [];

        if (imageList.length > 1) {
          throw new Error(
            "You are not allowed to add more than 1 image for the company."
          );
        }

        // If the user sends new image for the cover image, new image uploaded by
        // the uploadImage middleware will be sent to matched data
        if (imageList.length) {
          return imageList[0];
        }

        // We just have to parse the value because it is in the form of string object like "{...}"
        if (value) {
          try {
            return JSON.parse(value);
          } catch {
            throw new Error("Invalid image object for the cover image.");
          }
        }
        return undefined;
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
