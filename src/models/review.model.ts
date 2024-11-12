import mongoose, { Schema, Document } from "mongoose";
import { TImage } from "../types";
import { TUser } from "./user.model";
import { TCompany } from "./company.model";
import { TMenu } from "./menu.model";

export enum ReactionType {
  HEART = "HEART",
  LIKE = "LIKE",
  SAD = "SAD",
  ANGRY = "ANGRY",
}

type Reaction = {
  reacted_by: mongoose.Schema.Types.ObjectId | null | TUser;
  react_date: Date;
  react: ReactionType;
};

export type TReview = Document & {
  review_by: mongoose.Schema.Types.ObjectId | null | TUser;
  company: mongoose.Schema.Types.ObjectId | null | TCompany;
  menu?: mongoose.Schema.Types.ObjectId | null | TMenu;
  images: TImage[];
  review: string;
  rating_star: number;
  created_date: Date;
  reactions: Reaction[];
  is_deleted: boolean;
};

// Define reaction schema
const reactionSchema = new Schema<Reaction>({
  reacted_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  react_date: { type: Date, default: Date.now, immutable: true },
  react: {
    type: String,
    enum: Object.values(ReactionType),
    required: true,
  },
});

// Define Review Schema
const reviewSchema = new Schema<TReview>({
  review_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  menu: { type: Schema.Types.ObjectId, ref: "Menu", required: false },
  images: [
    {
      type: {
        url: String,
        fileId: String,
        fileName: String,
        container_name: String,
      },
      required: true,
    },
  ],
  review: { type: String, required: true },
  rating_star: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  created_date: { type: Date, default: Date.now, immutable: true },
  reactions: { type: [reactionSchema], default: [] },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const Review = mongoose.model<TReview>("Review", reviewSchema);
export default Review;
