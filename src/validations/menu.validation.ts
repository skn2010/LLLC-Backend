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
        const images = req.files?.["images"];

        if (!images || !images.length) {
          throw new Error("At least one image is required to create a menu.");
        }

        if (images.length > 5) {
          throw new Error(
            "You cannot add more than 5 images to create a menu."
          );
        }

        // Validate file type, size, etc.
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        req.files?.["images"].forEach((file: any) => {
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
    optional: true,
    custom: {
      options: (value, { req }) => {
        // Parse the stringified JSON array into a JavaScript array
        let imageList: any = [];
        try {
          imageList = JSON.parse(value || "[]");
        } catch (error) {
          throw new Error(
            "Invalid format for images field; it should be a valid JSON string."
          );
        }

        if (!Array.isArray(imageList)) {
          throw new Error("Images must be sent as a list of image object.");
        }

        // Let's count the number of the un-updated images and new images
        let numberOfUnUpdatedImages = 0;
        const numberOfNewImages = req.files?.["images"]?.length || 0;

        // When the user sends more than 5 new images for the menu, this error message will be sent
        if (numberOfNewImages > 5) {
          throw new Error("You are not allowed to add more than 5 images.");
        }

        imageList?.forEach((imgObject: any) => {
          if (typeof imgObject === "object") {
            // Verify if the image's object is right or wrong
            if (
              !imgObject.fileId ||
              !imgObject.fileName ||
              !imgObject.container_name ||
              !imgObject.url
            ) {
              throw new Error(
                "Each existing image object must contain fileId, fileName, container_name and url."
              );
            } else {
              numberOfUnUpdatedImages++;
            }
          }
        });

        // When the number of images after adding both un-updated and new images is greater than 5, this error message will be sent
        if (numberOfNewImages + numberOfNewImages > 5) {
          throw new Error("You are not allowed to add more than 5 images.");
        }

        // Verify the new images
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        req.files?.["images"]?.forEach((file: any) => {
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
