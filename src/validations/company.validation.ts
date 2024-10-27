import { Schema } from "express-validator";
import { TImage } from "../types";

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

  cover_image: {
    in: ["body"],
    optional: true,
    custom: {
      options: (_value, { req }) => {
        const image = req.files?.["image"]?.[0];

        // Cover image is optional field
        if (!image) {
          return true;
        }

        if (image.length > 1) {
          throw new Error(
            "You are not allowed to add more than 1 image for the company."
          );
        }

        // Validate file type, size, etc.
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!allowedMimeTypes.includes(image.mimetype)) {
          throw new Error(
            "Invalid file type. Only JPEG, JPG, and PNG are allowed."
          );
        }

        return true;
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

  cover_image: {
    in: ["body"],
    optional: true,
    custom: {
      options: (value, { req }) => {
        // When the image filed is empty
        if (!value) {
          return true;
        }

        // Parsed string image object to JS native object
        let imgObject: TImage | null = null;

        if (value) {
          try {
            imgObject = JSON.parse(value);
          } catch (e) {
            throw new Error("Cover image parsed error.");
          }
        }

        // Verify if the image object sent by user right
        if (
          imgObject &&
          (!imgObject.fileId ||
            !imgObject.fileName ||
            !imgObject.container_name ||
            !imgObject.url)
        ) {
          throw new Error(
            "Each existing image object must contain fileId, fileName, container_name and url."
          );
        }

        // If the user updates new image for the cover image
        const newImage = req.files?.["cover_image"]?.[0];

        // Cover image is optional field
        if (!newImage) {
          return true;
        }

        if (newImage.length > 1) {
          throw new Error(
            "You are not allowed to add more than 1 image for the cover image."
          );
        }

        // Validate file type, size, etc.
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!allowedMimeTypes.includes(newImage.mimetype)) {
          throw new Error(
            "Invalid file type. Only JPEG, JPG, and PNG are allowed."
          );
        }
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
