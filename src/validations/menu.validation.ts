import { Schema } from "express-validator";

export const menuCreateSchema: Schema = {
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

  description: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Description is required.",
    },
  },

  tag: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Tag is required.",
    },
    isIn: {
      options: [["NEW", "POPULAR"]],
      errorMessage: "Tag must be either 'NEW' or 'POPULAR'.",
    },
  },

  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Invalid price.",
    },
    optional: true,
  },

  company: {
    in: ["body"],
    isMongoId: {
      errorMessage: "Company ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },

  images: {
    in: ["body"],
    custom: {
      options: (_value, { req }) => {
        if (!req.files || req.files.length === 0) {
          throw new Error("At least one image is required.");
        }

        // Validate file type, size, etc.
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        req.files.forEach((file: any) => {
          if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(
              "Invalid file type. Only JPEG, JPG, and PNG are allowed."
            );
          }
        });

        return true;
      },
    },
  },
};

export const menuUpdateSchema: Schema = {
  name: {
    in: ["body"],
    trim: true,
    optional: true,
    isString: {
      errorMessage: "Name must be a string.",
    },
    notEmpty: {
      errorMessage: "Name is required.",
    },
  },

  description: {
    in: ["body"],
    trim: true,
    optional: true,
    notEmpty: {
      errorMessage: "Description is required.",
    },
  },

  tag: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Tag is required.",
    },
    isIn: {
      options: [["NEW", "POPULAR"]],
      errorMessage: "Tag must be either 'NEW' or 'POPULAR'.",
    },
    optional: true,
  },

  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Invalid price.",
    },
    optional: true,
  },

  images: {
    in: ["body"],
    optional: true,
    custom: {
      options: (_value, { req }) => {
        if (!req.files || req.files.length === 0) {
          throw new Error("At least one image is required.");
        }

        // Validate file type, size, etc.
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        req.files.forEach((file: any) => {
          if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(
              "Invalid file type. Only JPEG, JPG, and PNG are allowed."
            );
          }
        });

        return true;
      },
    },
  },

  menuId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Menu ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },
};

export const menuDeleteSchema: Schema = {
  menuId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Menu ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },
};

export const menuGetSchema: Schema = {
  menuId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Menu ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },
};

export const menusDropdownOfCompanyGetSchema: Schema = {
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

export const menusOfCompanyGetSchema: Schema = {
  companyId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Company ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Company id is required.",
    },
  },
  page: {
    in: ["query"],
    isNumeric: {
      errorMessage: "Page number must be a positive integer",
    },
    notEmpty: {
      errorMessage: "Page number is required.",
    },
  },
  pageSize: {
    in: ["query"],
    isNumeric: {
      errorMessage: "Page size number must be a positive integer",
    },
    notEmpty: {
      errorMessage: "Page size number is required.",
    },
  },
  search: {
    in: ["query"],
    isString: {
      errorMessage: "Invalid search keyword",
    },
    optional: true,
  },
};
