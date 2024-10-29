import { Schema } from "express-validator";
import { TImage } from "../types";

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
    customSanitizer: {
      options: (_value, { req }) => {
        const imageList = req?.uploadedImages?.images || [];

        if (imageList.length > 5) {
          throw new Error(
            "You are not allowed to add more than 5 images for the menu."
          );
        }
        return imageList;
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
  },

  description: {
    in: ["body"],
    trim: true,
    optional: true,
  },

  tag: {
    in: ["body"],
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
    customSanitizer: {
      options: (value, { req }) => {
        const imageList: TImage[] = [];

        try {
          const parsedValue = JSON.parse(value || "[]");
          imageList.push(...parsedValue);
        } catch {
          throw new Error("Invalid images object for the menu object.");
        }

        // Let's append new images
        imageList.push(...(req?.uploadedImages?.images || []));

        // Verify the side of the image

        if (imageList.length > 5) {
          throw new Error(
            "You are not allowed to add more than 5 images for the menu."
          );
        }
        return imageList;
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
