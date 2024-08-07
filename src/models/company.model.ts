import mongoose, { Schema, Document, Model, Types } from "mongoose";
import type { TUser } from "./user.model";
import type { TCategory } from "./category.modal";

const { String, Boolean, ObjectId } = Schema.Types;

export type TCompany = Document & {
  name: string;
  email: string;
  opening_time: string;
  closing_time: string;
  description: string;
  contact_number: string;
  is_deleted: boolean;
  cover_image: {
    url: string;
    fileId: string;
    fileName: string;
    contentType: string;
  } | null;
  location: { latitude: number; longitude: number };
  category: Types.ObjectId | TCategory | null;
  created_by: Types.ObjectId | TUser | null;
  updated_date: Date | null;
  created_date: Date;
};

const companySchema = new Schema<TCompany>({
  name: {
    type: String,
    required: [true, "Company name is required."],
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  opening_time: {
    type: String,
    required: [true, "Opening hour is required."],
  },

  closing_time: {
    type: String,
    required: [true, "Closing hour is required."],
  },

  description: {
    type: String,
    required: [true, "Description is required."],
  },

  contact_number: {
    type: String,
    required: [true, "Contact number is required."],
  },

  cover_image: {
    type: {
      url: String,
      fileId: String,
      fileName: String,
      contentType: String,
    },
    default: null,
  },

  is_deleted: {
    type: Boolean,
    default: false,
  },

  location: {
    latitude: String,
    longitude: String,
  },

  created_by: {
    type: ObjectId,
    ref: "User",
    default: null,
    required: [true, "Created by is required."],
  },

  category: {
    type: ObjectId,
    ref: "Category",
    default: null,
    required: [true, "Category is required."],
  },

  updated_date: {
    type: Date,
    required: false,
    default: null,
  },

  created_date: {
    type: Date,
    required: true,
    immutable: true,
    default: Date.now,
  },
});

const Company: Model<TCompany> = mongoose.model<TCompany>(
  "Company",
  companySchema
);

export default Company;
