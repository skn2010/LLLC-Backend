import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { TUser } from "./user.model";

const { String, Boolean, ObjectId } = Schema.Types;

export type TCategory = Document & {
  name: string;
  image: {
    url: string;
    fileId: string;
    fileName: string;
    contentType: string;
  } | null;

  is_active: boolean;
  created_by: Types.ObjectId | TUser | null;
  updated_date: Date | null;
  created_date: Date;
};

const categorySchema = new Schema<TCategory>({
  name: {
    type: String,
    unique: true,
    required: [true, "Name is required."],
  },

  image: {
    type: {
      url: String,
      fileId: String,
      fileName: String,
      contentType: String,
    },
    default: null,
  },

  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },

  created_by: {
    type: ObjectId,
    ref: "User",
    default: null,
    required: [true, "Created by is required."],
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

categorySchema.pre("updateOne", function (next) {
  this.set({ updated_date: new Date() });
  next();
});

const Category: Model<TCategory> = mongoose.model<TCategory>(
  "Category",
  categorySchema
);

export default Category;
