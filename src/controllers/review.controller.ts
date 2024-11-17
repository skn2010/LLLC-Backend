import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as services from "../services/review.service";
import { TUser } from "../models/user.model";

export async function createReview(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });
  payload.review_by = req.user?._id;
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

  const data = await services.deleteReview({
    params: { reviewId: params.reviewId },
    authorization: { user: req.user as TUser },
  });

  return res.json({ data, message: "Review deleted successfully." });
}

export async function getReviewsOfCompany(req: Request, res: Response) {
  const { companyId } = matchedData(req, { locations: ["params"] });
  const { page, pageSize } = matchedData(req, { locations: ["query"] });

  const response = await services.getReviewOfCompany({
    params: { companyId },
    user: req.user || null,
    queries: { page, pageSize: Number(pageSize) || 12 },
  });

  return res.json(response);
}

export async function getReviewOfMenu(req: Request, res: Response) {
  const { menuId } = matchedData(req, { locations: ["params"] });
  const { page, pageSize } = matchedData(req, { locations: ["query"] });

  const response = await services.getReviewOfMenu({
    params: { menuId },
    user: req.user || null,
    queries: { page, pageSize: Number(pageSize) || 12 },
  });

  return res.json(response);
}

export async function reactOnReview(req: Request, res: Response) {
  const { reviewId } = matchedData(req, { locations: ["params"] });
  const { reactionType } = matchedData(req, { locations: ["body"] });

  const response = await services.reactOnReview({
    params: { reviewId },
    user: req.user as TUser,
    payload: { reactionType },
  });

  return res.json(response);
}

export async function removeReactOnReview(req: Request, res: Response) {
  const { reviewId } = matchedData(req, { locations: ["params"] });

  const response = await services.removeReactionFromReview({
    params: { reviewId },
    user: req.user as TUser,
  });

  return res.json(response);
}

export async function getPopularMenus(req: Request, res: Response) {
  const { page = 1, pageSize = 12 } = matchedData(req, {
    locations: ["query"],
  });

  const response = await services.getPopularReviews({
    queries: { page, pageSize },
    user: req.user as TUser,
  });
  return res.json(response);
}
