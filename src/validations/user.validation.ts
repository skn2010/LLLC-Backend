import { Schema } from "express-validator";

export const userListSchemaValidation: Schema = {
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
      errorMessage: "Short by must be a string.",
    },
    optional: true,
    trim: true,
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

export const singleSchemaValidation: Schema = {
  userId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "User ID must be a valid MongoDB document ID.",
    },
  },
};

export const userStatisticsSchemaValidation: Schema = {
  userId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "User ID must be a valid MongoDB document ID.",
    },
  },
};

export const userUpdateSchemaValidation: Schema = {
  userId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "User ID must be a valid MongoDB document ID.",
    },
  },

  contact: {
    in: ["body"],
    isString: {
      errorMessage: "Contact must be a string.",
    },
    optional: true,
    trim: true,
  },

  address: {
    in: ["body"],
    isString: {
      errorMessage: "Address must be a string.",
    },
    trim: true,
    optional: true,
  },

  status: {
    in: ["body"],
    isString: { errorMessage: "Invalid status." },
    trim: true,
    isIn: {
      options: [["ACTIVE", "INACTIVE", "DELETED"]],
      errorMessage: "Invalid status.",
    },
    optional: true,
  },
};

export const userDeleteSchemaValidation: Schema = {
  userId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "User ID must be a valid MongoDB document ID.",
    },
  },
};
