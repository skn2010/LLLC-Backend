import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as userServices from "../services/user.service";
import ApiError from "../utils/api-error.utils";

export async function getUserList(req: Request, res: Response) {
  const sanitizedData = matchedData(req);

  const data = await userServices.getUserList({
    page: sanitizedData.page,
    pageSize: sanitizedData.pageSize,
    sortBy: sanitizedData?.sortBy,
    search: sanitizedData?.search,
  });

  return res.json(data);
}

export async function getSingleUser(req: Request, res: Response) {
  const sanitizedData = matchedData(req);

  const user = await userServices.getUser(sanitizedData.userId);

  // Apply object level permission: (user itself or admin can get data)
  if (user._id.toString() !== req.user?._id.toString() && !req.user?.is_admin) {
    throw new ApiError({
      message: "You are not authorized to access this account.",
      statusCode: 403,
      name: "AUTHORIZATION_ERROR",
    });
  }

  return res.json({ data: user });
}

export async function updateUser(req: Request, res: Response) {
  const body = matchedData(req, { locations: ["body"] });
  const params = matchedData(req, { locations: ["params"] });

  // Apply object level permission: (user itself or admin can update data)
  if (params.userId !== req.user?._id.toString() && !req.user?.is_admin) {
    throw new ApiError({
      message: "You are not authorized to update this account.",
      statusCode: 403,
      name: "AUTHORIZATION_ERROR",
    });
  }

  const user = await userServices.updateUser(params.userId, body);

  return res.json({
    data: user,
    message: "User's details has been successfully updated.",
  });
}

export async function deleteUser(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });

  // Apply object level permission: (user itself or admin can delete user data)
  if (params.userId !== req.user?._id.toString() && !req.user?.is_admin) {
    throw new ApiError({
      message: "You are not authorized to delete this account.",
      statusCode: 403,
      name: "AUTHORIZATION_ERROR",
    });
  }

  const user = await userServices.updateUser(params.userId, {
    status: "DELETED",
  });

  return res.json({
    data: user,
    message: "The account has been successfully deleted.",
  });
}

export async function deleteUserPermanently(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });

  // Apply object level permission: (user itself or admin can delete user data)
  if (!req.user?.is_admin) {
    throw new ApiError({
      message: "You are not authorized to delete this account.",
      statusCode: 403,
      name: "AUTHORIZATION_ERROR",
    });
  }

  const user = await userServices.deleteUser(params.userId);

  return res.status(200).json({
    data: user,
    message: "The account has been successfully deleted.",
  });
}

export async function getUserStatistics(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });

  const response = await userServices.getUserStatistics({
    userId: params.userId,
  });

  return res.json({ data: response });
}
