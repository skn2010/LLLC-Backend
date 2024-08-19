import { ObjectId, Schema, model, Document } from "mongoose";
import { TImage } from "../types";

export type TMenu = Document & {
  name: string;
  description: string;
  images: TImage[];
  price?: number;
  tag: "POPULAR" | "NEW";
  created_by: ObjectId;
  is_deleted: Boolean;
  company: ObjectId;
  created_date: Date;
  updated_date: Date;
};

const menuSchema: Schema = new Schema<TMenu>({
  name: { type: String, required: true },
  description: { type: String, required: true },
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
  price: { type: Number },
  tag: { type: String, enum: ["POPULAR", "NEW"], required: true },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false,
    default: null,
  },
  updated_date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    required: true,
    immutable: true,
    default: Date.now,
  },
});

menuSchema.pre("updateOne", function (next) {
  this.set({ updated_date: new Date() });
  next();
});

const Menu = model<TMenu>("Menu", menuSchema);
export default Menu;
