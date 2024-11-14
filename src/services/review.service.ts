import mongoose from "mongoose";
import Review, { TReview, ReactionType } from "../models/review.model";
import { TUser } from "../models/user.model";
import ApiError from "../utils/api-error.utils";

export async function createReview({
  payload,
}: {
  payload: Omit<Partial<TReview>, "_id">;
}) {
  const review = new Review(payload);
  await review.save();
  return review;
}

export async function getMenuDetails({
  params,
}: {
  params: { reviewId: string };
}) {
  const { reviewId } = params;

  const review = await Review.findById(reviewId)
    .populate("reactions.reacted_by")
    .populate("menu")
    .populate("company")
    .populate("review_by");

  if (!review || review.is_deleted) {
    throw new ApiError({
      message: "Review with this id does not exist.",
      statusCode: 404,
      name: "VALIDATION_ERROR",
    });
  }

  // Count the total reactions and count by reaction type
  const reactionCounts = review.reactions.reduce(
    (counts, reaction) => {
      // Increase the total reaction count
      counts.total++;

      // Increment count for the specific reaction type
      if (reaction.react === ReactionType.HEART) {
        counts.heart++;
      } else if (reaction.react === ReactionType.LIKE) {
        counts.like++;
      } else if (reaction.react === ReactionType.SAD) {
        counts.sad++;
      } else if (reaction.react === ReactionType.ANGRY) {
        counts.angry++;
      }

      return counts;
    },
    {
      total: 0,
      heart: 0,
      like: 0,
      sad: 0,
      angry: 0,
    }
  );

  // Remove the reactions fields
  await review.populate("reactions");

  return {
    review,
    reactionCounts,
  };
}

export async function deleteReview({
  params,
  payload,
}: {
  params: { reviewId: string };
  payload: { user: TUser };
}) {
  const review = await Review.findById(params.reviewId);

  if (!review || review.is_deleted) {
    throw new ApiError({
      message: "Review with this id does not exist.",
      statusCode: 404,
      name: "VALIDATION_ERROR",
    });
  }

  // Object level verification (is the user requesting to delete is same one who has created this review or not)
  if (review.review_by?.toString() !== payload.user._id.toString()) {
    throw new ApiError({
      message: "You are not authorized to delete this review.",
      statusCode: 403,
      name: "AUTHORIZATION_ERROR",
    });
  }

  review.is_deleted = true;
  await review.save();

  return review;
}

export async function getReviewOfMenu({
  params,
  queries,
}: {
  params: {
    menuId: string;
  };
  queries: {
    page: number;
    pageSize: number;
  };
}) {
  const { menuId } = params;
  const { page = 1, pageSize = 10 } = queries;

  // Calculate the offset for pagination
  const offset = (page - 1) * pageSize;

  // Convert menuId to ObjectId if needed
  const menuObjectId = new mongoose.Types.ObjectId(menuId);

  // Filter to get reviews for the specific menu that are not deleted
  const filter = {
    menu: menuObjectId,
    is_deleted: false,
  };

  // Aggregation pipeline with reaction counts and pagination
  const pipeline = [
    { $match: filter }, // Apply the filter
    {
      $addFields: {
        totalReactions: { $size: "$reactions" }, // Count total reactions
        heartReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "heart"] }, // Replace with ReactionType.HEART if defined
            },
          },
        },
        sadReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "sad"] }, // Replace with ReactionType.SAD if defined
            },
          },
        },
        loveReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "love"] }, // Replace with ReactionType.LOVE if defined
            },
          },
        },
        angryReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "angry"] }, // Replace with ReactionType.ANGRY if defined
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "companies", // Name of the collection where the company is stored
        localField: "company", // Field in the reviews collection
        foreignField: "_id", // Field in the companies collection
        as: "company", // Alias for the populated company data
      },
    },
    {
      $lookup: {
        from: "users", // Name of the collection where the review_by (user) is stored
        localField: "review_by", // Field in the reviews collection
        foreignField: "_id", // Field in the users collection
        as: "review_by", // Alias for the populated user data
      },
    },
    {
      $unwind: { path: "$company", preserveNullAndEmptyArrays: true }, // Unwind the company array (only one company expected)
    },
    {
      $unwind: { path: "$review_by", preserveNullAndEmptyArrays: true }, // Unwind the review_by array (only one user expected)
    },
    { $skip: offset }, // Apply pagination
    { $limit: pageSize }, // Apply page size
    {
      $project: {
        reactions: 0, // Exclude the reactions array from the result
      },
    },
  ];

  // Execute aggregation to get the reviews with reaction counts and populated fields
  const reviews = await Review.aggregate(pipeline);

  // Get the total count of reviews that match the filter
  const totalCount = await Review.countDocuments(filter);

  // Return the paginated result with reaction counts and populated fields
  return {
    currentPage: page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    data: reviews,
  };
}

export async function getReviewOfCompany({
  params,
  queries,
}: {
  params: {
    companyId: string;
  };
  queries: {
    page: number;
    pageSize: number;
  };
}) {
  const { companyId } = params;
  const { page = 1, pageSize = 10 } = queries;

  // Calculate the offset for pagination
  const offset = (page - 1) * pageSize;

  // Convert companyId to ObjectId if needed
  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  // Filter to get reviews for the specific company that are not deleted
  const filter = {
    company: companyObjectId,
    is_deleted: false,
  };

  // Aggregation pipeline with reaction counts and pagination
  const pipeline = [
    { $match: filter }, // Apply the filter
    {
      $addFields: {
        totalReactions: { $size: "$reactions" }, // Count total reactions
        heartReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "heart"] }, // Replace with ReactionType.HEART if defined
            },
          },
        },
        sadReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "sad"] }, // Replace with ReactionType.SAD if defined
            },
          },
        },
        loveReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "love"] }, // Replace with ReactionType.LOVE if defined
            },
          },
        },
        angryReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "angry"] }, // Replace with ReactionType.ANGRY if defined
            },
          },
        },
      },
    },
    { $skip: offset }, // Apply pagination
    { $limit: pageSize }, // Apply page size
    {
      $project: {
        reactions: 0, // Exclude the reactions array from the result
      },
    },
  ];

  // Execute aggregation to get the reviews with reaction counts
  const reviews = await Review.aggregate(pipeline);

  // Get the total count of reviews that match the filter
  const totalCount = await Review.countDocuments(filter);

  // Return the paginated result with reaction counts
  return {
    currentPage: page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    data: reviews,
  };
}

// ---------------------------------------------------------------------------------------------------------------------

export async function reactOnReview({
  params,
  payload,
  user,
}: {
  params: { reviewId: string };
  payload: { reactionType: ReactionType };
  user: TUser;
}) {
  const { reviewId } = params;
  const { reactionType } = payload;

  // Find the review document by reviewId
  const review = await Review.findById(reviewId);

  if (!review || review.is_deleted) {
    throw new ApiError({
      message: "Review with this id does not exist.",
      statusCode: 404,
      name: "VALIDATION_ERROR",
    });
  }

  // Check if the user has already reacted to this review
  const existingReaction = review.reactions.find(
    (reaction) => reaction.reacted_by?.toString() === user._id.toString()
  );

  if (existingReaction) {
    // If the user has already reacted, update their reaction type
    existingReaction.react = reactionType;

    // Save the review with the updated reactions array
    await review.save();

    return {
      message: "Reaction updated successfully",
      reviewId,
      reactionType,
    };
  } else {
    // If no reaction exists, add a new reaction for the user
    review.reactions.push({
      reacted_by: user._id,
      react_date: new Date(),
      react: reactionType,
    });

    // Save the review with the new reaction added
    await review.save();

    return {
      message: "Reaction added successfully",
      reviewId,
      reactionType,
    };
  }
}

export async function removeReactionFromReview({
  params,
  user,
}: {
  params: { reviewId: string };
  user: TUser;
}) {
  const { reviewId } = params;

  // Use the $pull operator to remove the user's reaction from the reactions array
  const result = await Review.updateOne(
    { _id: reviewId, "reactions.reacted_by": user._id },
    { $pull: { reactions: { reacted_by: user._id } } }
  );

  if (result.modifiedCount === 0) {
    throw new ApiError({
      message: "Review with this id does not exist.",
      statusCode: 404,
      name: "VALIDATION_ERROR",
    });
  }

  return {
    message: "Reaction removed successfully",
    reviewId,
  };
}
