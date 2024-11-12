import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as services from "../services/review.service";
import { TUser } from "../models/user.model";

// Add statistics like total numbers of reaction such as heart, sad.... except all reactions list
export async function getReviewsOfCompany(req: Request, res: Response) {
  // ADD STATISTICS like total number of reaction (heart, sad,....)
}

// ------------------------------------------------------------
export async function createReview(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });
  const data = await services.createReview({ payload });

  return res
    .status(201)
    .json({ data, message: "Create menu added successfully." });
}

export async function getReviewDetails(req: Request, res: Response) {
  const { reviewId } = matchedData(req, { locations: ["params"] });

  const data = await services.getMenuDetails({
    params: { reviewId },
  });

  // data: {review, reactionCounts}
  return res.json(data);
}

export async function deleteReview(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });
  const userId = req.user?._id;

  const data = await services.deleteReview({
    params: { reviewId: params.reviewId },
    payload: { user: req.user as TUser },
  });

  return res.json({ data, message: "Review deleted successfully." });
}

//-------------------------------------------------------------------------------

export async function reactOnReview(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });
}

export async function removeReactOnReview(req: Request, res: Response) {
  // Does not need any schema validation
  const userId = req.user?._id;
}
