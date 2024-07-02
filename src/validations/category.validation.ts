import { Schema } from "express-validator";

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
