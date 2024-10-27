import { Schema } from "express-validator";
import { TImage } from "../types";

export const categoryListSchemaValidation: Schema = {
  page: {
    in: ["query"],
    isNumeric: {
      errorMessage: "Page must be an integer.",
    },
    notEmpty: {
      errorMessage: "Page is required",
    },
    custom: {
      options: (value: number) => {
        if (!Number.isInteger(Number(value)) || Number(value) < 1) {
          throw new Error("Page must be a positive integer greater than zero.");
        }
        return true;
      },
    },
  },

  pageSize: {
    in: ["query"],
    isNumeric: {
      errorMessage: "Page size must be an integer.",
    },
    optional: true,
    custom: {
      options: (value: number) => {
        if (!Number.isInteger(Number(value)) || Number(value) < 1) {
          throw new Error("Page must be a positive integer greater than zero.");
        }
        return true;
      },
    },
  },

  sortBy: {
    in: ["query"],
    isString: {
      errorMessage: "Sort by must be a string.",
    },
    optional: true,
    trim: true,
  },

  sortOrder: {
    in: ["query"],
    isNumeric: {
      errorMessage: "Sort by must be a number.",
    },
    custom: {
      options: (value: number) => {
        if (Number(value) === 1 || Number(value) === -1) {
          return true;
        }

        throw new Error("Sort by must be either 1 or -1");
      },
    },
    optional: true,
  },

  search: {
    in: ["query"],
    isString: {
      errorMessage: "Search keyword must be a string.",
    },
    trim: true,
    optional: true,
  },
};

export const categoryCreateSchemaValidation: Schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string.",
    },
    trim: true,
    notEmpty: {
      errorMessage: "Name is required.",
    },
  },

  image: {
    in: ["body"],
    optional: true,
    custom: {
      options: (_value, { req }) => {
        const image = req.files?.["image"]?.[0];

        // Category image is optional field
        if (!image) {
          return true;
        }

        if (image.length > 1) {
          throw new Error(
            "You are not allowed to add more than 1 image for the category."
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

export const categoryUpdateSchemaValidation: Schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string.",
    },
    trim: true,
    optional: true,
  },

  image: {
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
            throw new Error("Category image parsed error.");
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

        // If the user updates new image for the category
        const newImage = req.files?.["image"]?.[0];

        // Category image is optional field
        if (!newImage) {
          return true;
        }

        if (newImage.length > 1) {
          throw new Error(
            "You are not allowed to add more than 1 image for the category."
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

  is_active: {
    in: ["body"],
    isBoolean: {
      errorMessage: "Is active should be boolean value.",
    },
    optional: true,
  },

  created_by: {
    in: ["body"],
    isMongoId: {
      errorMessage: "Category ID must be a valid MongoDB document ID.",
    },
    optional: true,
  },

  categoryId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Category ID must be a valid MongoDB document ID.",
    },
  },
};

export const singleCategoryGetSchemaValidation: Schema = {
  categoryId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Category ID must be a valid MongoDB document ID.",
    },
  },
};

export const categoryDeleteSchemaValidation: Schema = {
  categoryId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Category ID must be a valid MongoDB document ID.",
    },
  },
};
