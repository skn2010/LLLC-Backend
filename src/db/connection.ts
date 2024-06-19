import mongoose from "mongoose";

export async function connectDB() {
  const url = process.env.MONGODB_URL;

  try {
    if (!url) {
      throw Error("MongoDB url not found!");
    }

    await mongoose.connect(url);
    console.log("MongoDB connected!");
  } catch (error) {
    console.log("MongoDB connection failed!");
    console.log(error);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log("MongoDB disconnecting failed!");
    console.log(error);
  }
}
