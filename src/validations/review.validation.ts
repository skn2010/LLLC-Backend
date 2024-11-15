import { Schema } from "express-validator";
import { TImage } from "../types";

export const createSchema: Schema = {
  review: {
    in: ["body"],
    trim: true,
    isString: {
      errorMessage: "Review must be a string.",
    },
    notEmpty: {
      errorMessage: "Review is required.",
    },
  },

  rating_star: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Invalid rating star.",
    },
    notEmpty: {
      errorMessage: "Rating star is required.",
    },
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

  menu: {
    in: ["body"],
    isMongoId: {
      errorMessage: "Menu ID must be a valid MongoDB document ID.",
    },
    optional: true,
  },

  images: {
    in: ["body"],
    customSanitizer: {
      options: (_value, { req }) => {
        const imageList: TImage[] = req?.uploadedImages?.images || [];

        if (imageList.length > 5) {
          throw new Error(
            "You are not allowed to add more than 5 images for the menu."
          );
        }

        if (!imageList.length) {
          throw new Error("Images is required.");
        }

        return imageList;
      },
    },
  },
};

export const getDetailsSchema: Schema = {
  reviewId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Review ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Review id is required.",
    },
  },
};

export const deleteReviewSchema: Schema = {
  reviewId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Review by ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Review Id is required.",
    },
  },
};

export const addReactionSchema: Schema = {
  reactionType: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Reaction type is required.",
    },
    isIn: {
      options: [["HEART", "LIKE", "SAD", "ANGRY"]],
      errorMessage: "Invalid reaction type.",
    },
  },

  reviewId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Review ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Review id is required.",
    },
  },
};

export const removeReactionSchema: Schema = {
  reviewId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Review ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Review id is required.",
    },
  },
};

export const getCompanyMenuReviewSchema: Schema = {
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
};

export const getMenuReviewSchema: Schema = {
  menuId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Menu ID must be a valid MongoDB document ID.",
    },
    notEmpty: {
      errorMessage: "Menu id is required.",
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
    optional: true,
  },
};
