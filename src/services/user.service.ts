import mongoose, { UpdateQuery } from "mongoose";
import User, { TUser } from "../models/user.model";
import Review, { ReactionType } from "../models/review.model";
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

export async function getUser(id: string | mongoose.Types.ObjectId) {
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

export async function getUserStatistics({ userId }: { userId: string }) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const reactionStats = await Review.aggregate([
    {
      $match: {
        review_by: userObjectId,
        is_deleted: false,
      },
    },
    {
      $unwind: "$reactions",
    },
    {
      $group: {
        _id: "$reactions.react",
        totalReactions: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        reactionCounts: { $push: { type: "$_id", count: "$totalReactions" } },
        totalReactions: { $sum: "$totalReactions" },
      },
    },
    {
      $project: {
        _id: 0,
        totalReactions: 1,
        reactionCounts: {
          $arrayToObject: {
            $map: {
              input: "$reactionCounts",
              as: "reaction",
              in: { k: "$$reaction.type", v: "$$reaction.count" },
            },
          },
        },
      },
    },
  ]);

  return {
    reaction: reactionStats[0] || {
      totalReactions: 0,
      reactionCounts: {
        [ReactionType.HEART]: 0,
        [ReactionType.LIKE]: 0,
        [ReactionType.SAD]: 0,
        [ReactionType.ANGRY]: 0,
      },
    },
  };
}
