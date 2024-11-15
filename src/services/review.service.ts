import mongoose, { PipelineStage } from "mongoose";
import Review, { TReview, ReactionType } from "../models/review.model";
import { TUser } from "../models/user.model";
import ApiError from "../utils/api-error.utils";
import { TCompany } from "../models/company.model";
import { TMenu } from "../models/menu.model";

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
  authorization,
}: {
  params: { reviewId: string };
  authorization: { user: TUser };
}) {
  const review = await Review.findById(params.reviewId)
    .populate("menu")
    .populate("company");

  if (!review || review.is_deleted) {
    throw new ApiError({
      message: "Review with this id does not exist.",
      statusCode: 404,
      name: "VALIDATION_ERROR",
    });
  }

  // Ensure menu and company are populated properly
  const company = review.company as TCompany;
  const menu = review.menu as TMenu;

  // Authorization logic
  if (
    (company?.created_by?.toString() !== authorization.user._id.toString() ||
      menu?.created_by?.toString() !== authorization.user._id.toString()) &&
    !authorization.user.is_admin && // Check if the user is an admin
    review.review_by?.toString() !== authorization.user._id.toString() // Check if the user is the one who created the review
  ) {
    throw new ApiError({
      message: "You are not authorized to delete this review.",
      statusCode: 403,
      name: "AUTHORIZATION_ERROR",
    });
  }

  // Mark the review as deleted
  review.is_deleted = true;
  await review.save();

  return review;
}

export async function getReviewOfMenu({
  params,
  queries,
  user,
}: {
  params: {
    menuId: string;
  };
  queries: {
    page: number;
    pageSize: number;
  };
  user: TUser | null;
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

  // Aggregation pipeline with reaction counts, pagination, and sorting by creation date
  const userId = user ? user._id : null;

  const pipeline: PipelineStage[] = [
    // Optional: Filter reviews based on other criteria
    { $match: filter },

    // Add fields for each reaction count
    {
      $addFields: {
        totalReactions: { $size: "$reactions" },
        heartReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "HEART"] },
            },
          },
        },
        likeReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "LIKE"] },
            },
          },
        },
        sadReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "SAD"] },
            },
          },
        },
        angryReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "ANGRY"] },
            },
          },
        },

        // Add field for the logged-in user's reaction type
        reacted_type_by_user: {
          $let: {
            vars: {
              userReaction: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$reactions",
                      as: "reaction",
                      cond: { $eq: ["$$reaction.reacted_by", userId] },
                    },
                  },
                  0,
                ],
              },
            },
            in: { $ifNull: ["$$userReaction.react", null] },
          },
        },
      },
    },

    // Join with company and user details if needed
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "review_by",
        foreignField: "_id",
        as: "review_by",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$review_by", preserveNullAndEmptyArrays: true } },

    // Sort, paginate, and project fields as required
    { $sort: { created_date: -1 } },
    { $skip: offset },
    { $limit: pageSize },
    {
      $project: {
        reactions: 0, // Optionally exclude the reactions array if not needed in the output
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
  user,
}: {
  params: {
    companyId: string;
  };
  queries: {
    page: number;
    pageSize: number;
  };
  user: TUser | null;
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

  // Aggregation pipeline with reaction counts, pagination, and sorting by creation date
  const userId = user ? user._id : null;

  const pipeline: PipelineStage[] = [
    // Filter reviews based on company ID
    { $match: filter },

    // Add fields for each reaction count
    {
      $addFields: {
        totalReactions: { $size: "$reactions" },
        heartReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "HEART"] },
            },
          },
        },
        likeReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "LIKE"] },
            },
          },
        },
        sadReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "SAD"] },
            },
          },
        },
        angryReactions: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: { $eq: ["$$reaction.react", "ANGRY"] },
            },
          },
        },

        // Add field for the logged-in user's reaction type
        reacted_type_by_user: {
          $let: {
            vars: {
              userReaction: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$reactions",
                      as: "reaction",
                      cond: { $eq: ["$$reaction.reacted_by", userId] },
                    },
                  },
                  0,
                ],
              },
            },
            in: { $ifNull: ["$$userReaction.react", null] },
          },
        },
      },
    },

    // Join with company and user details if needed
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "review_by",
        foreignField: "_id",
        as: "review_by",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$review_by", preserveNullAndEmptyArrays: true } },

    // Sort, paginate, and project fields as required
    { $sort: { created_date: -1 } },
    { $skip: offset },
    { $limit: pageSize },
    {
      $project: {
        reactions: 0, // Optionally exclude the reactions array if not needed in the output
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
