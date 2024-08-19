import { Document, Model, Types } from "mongoose";
import ApiError from "./api-error.utils";

type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default async function getPaginatedData<T extends Document>(
  model: Model<T>,
  page: number = 1,
  pageSize: number = 16,
  sortBy?: { fieldName: string; sortOrder: -1 | 1 },
  filter?: Record<string, any>
): Promise<PaginatedResult<T>> {
  try {
    // Calculate skip value for pagination
    const skip = Math.max(0, (page - 1) * pageSize);

    // Create a base query
    const baseQuery: Record<string, any> = filter ? { $and: [] } : {};

    // If filter is provided, construct the $and conditions
    if (filter) {
      for (const key in filter) {
        if (Object.prototype.hasOwnProperty.call(filter, key)) {
          if (Array.isArray(filter[key])) {
            // Handle array-based filters with $in
            baseQuery.$and.push({
              [key]: { $in: filter[key] },
            });
          } else if (
            key === "like_by" ||
            key === "post" ||
            key === "save_by" ||
            key == "search_by"
          ) {
            // Handle ObjectId filters without $regex
            baseQuery.$and.push({
              [key]: filter[key] as Types.ObjectId,
            });
          } else {
            // Handle other filters with $regex (case-insensitive)
            baseQuery.$and.push({
              [key]: { $regex: new RegExp(filter[key], "i") },
            });
          }
        }
      }
    }

    // Find all documents, apply sorting, search, and pagination
    const data = await model
      .find(baseQuery)
      .sort(sortBy ? { [sortBy.fieldName]: sortBy.sortOrder } : undefined)
      .skip(skip)
      .limit(pageSize);

    // Get the total count of documents in the collection with the search query applied
    const total = await model.countDocuments(baseQuery);

    // Calculate total pages
    const totalPages = Math.ceil(total / pageSize);

    // You can perform additional actions or logging here if needed

    return {
      data,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages,
    };
  } catch (error: any) {
    // Handle pagination error
    throw new ApiError({
      message: error?.message || "Internal server error.",
      statusCode: 500,
      name: "PAGINATION_ERROR",
    });
  }
}
