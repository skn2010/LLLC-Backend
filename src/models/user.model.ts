import mongoose, { Schema, Document, Model } from "mongoose";
const { String, Boolean } = Schema.Types;

export type TUser = Document & {
  full_name: string;
  email: string;
  contact?: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  avatar: string;
  is_admin: boolean;
  updated_date: Date | null;
  join_date: Date;
};

const userSchema = new Schema<TUser>({
  full_name: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    validate: {
      validator: async function (value: string): Promise<boolean> {
        const user = await mongoose.model("User").findOne({ email: value });
        return !user;
      },
      message: "Email is already in use.",
    },
  },
  contact: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "DELETED"],
    required: true,
    default: "ACTIVE",
  },
  avatar: {
    type: String,
    required: [true, "Your avatar is required"],
  },
  is_admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  updated_date: {
    type: Date,
    required: false,
    default: null,
  },
  join_date: {
    type: Date,
    immutable: true,
    required: true,
    default: Date.now,
  },
});

userSchema.pre("updateOne", function (next) {
  this.set({ updated_date: new Date() });
  next();
});

const User: Model<TUser> = mongoose.model<TUser>("User", userSchema);

export default User;
