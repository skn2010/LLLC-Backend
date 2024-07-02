import { ObjectId, UpdateQuery } from "mongoose";
import User, { TUser } from "../models/user.model";
import ApiError from "../utils/api-error.utils";
import getPaginatedData from "../utils/pagination.utils";

export async function getUserList({
  page,
  pageSize,
  sortBy,
  search,
}: {
  page: number;
  pageSize: number;
  sortBy?: string;
  search?: any;
}) {
  return await getPaginatedData<TUser>(
    User,
    page,
    pageSize,
    sortBy ? { fieldName: sortBy, sortOrder: 1 } : undefined,
    search?.trim() ? { name: search.trim() } : undefined
  );
}

export async function getUser(id: string | ObjectId) {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError({
      message: "User not found.",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  return user;
}

export async function updateUser(
  userId: string,
  updateFields: UpdateQuery<TUser>
) {
  const user = await User.findByIdAndUpdate(userId, updateFields, {
    new: true, // Return the updated document
    runValidators: true, // Run validators (e.g., for required fields, unique email validation)
  });

  if (!user) {
    throw new ApiError({
      message: "User not found.",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  return user;
}

export async function deleteUser(userId: string) {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError({
      message: "User not found.",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  return user;
}
