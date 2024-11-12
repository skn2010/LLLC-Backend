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

  const review = await Review.findById(reviewId).populate(
    "reactions.reacted_by"
  );

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
