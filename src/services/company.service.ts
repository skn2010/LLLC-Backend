import mongoose from "mongoose";
import Company, { TCompany } from "../models/company.model";
import Review, { TReview } from "../models/review.model";
import ApiError from "../utils/api-error.utils";
import { deleteFile } from "./backblaze.service";

export async function createCompany(
  createdBy: mongoose.Types.ObjectId,
  payload: Partial<TCompany>
) {
  const existedCompany = await Company.findOne({
    name: payload.name,
    created_by: createdBy,
  });

  // Throw error if the company with the same name and user exist
  if (existedCompany) {
    throw new ApiError({
      message: "Company with this name has already existed.",
      statusCode: 400,
      name: "VALIDATION_ERROR",
    });
  }

  const newCompany = new Company(payload);
  await newCompany.save();
  return newCompany;
}

export async function getAllCompanyListOfUser(userId: mongoose.Types.ObjectId) {
  const companyListOfUser = await Company.find({
    created_by: userId,
    is_deleted: false,
  });

  return companyListOfUser;
}

export async function updateCompany(
  id: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId,
  payload: Partial<TCompany>
) {
  const existedCompany = await Company.findOne({
    name: payload.name,
    created_by: createdBy,
  });

  if (
    existedCompany &&
    !(existedCompany?._id as mongoose.Types.ObjectId).equals(id)
  ) {
    throw new ApiError({
      message: "Company with this name has already existed.",
      statusCode: 400,
      name: "VALIDATION_ERROR",
    });
  }

  if (
    existedCompany &&
    existedCompany.is_deleted &&
    (existedCompany._id as mongoose.Types.ObjectId).equals(id)
  ) {
    throw new ApiError({
      message: "Company not found.",
      name: "NOT_FOUND_ERROR",
      statusCode: 404,
    });
  }

  // Let's update
  const company = await Company.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  // Let's delete old cover image
  if (
    payload.cover_image &&
    existedCompany?.cover_image &&
    payload.cover_image.url !== existedCompany.cover_image.url
  ) {
    deleteFile({
      fileId: existedCompany?.cover_image.fileId,
      fileName: existedCompany?.cover_image.fileName,
    }).catch((e) => {
      console.log(e, " IMAGE_DELETE_ERROR");
    });
  }

  return company;
}

export async function getCompanyById(companyId: mongoose.Types.ObjectId) {
  const company = await Company.findById(companyId).populate("created_by");

  if (!company || company.is_deleted) {
    throw new ApiError({
      message: "Company not found",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  const reviewStats = await Review.aggregate([
    {
      $match: {
        company: company._id,
        is_deleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating_star" },
        totalRatingStars: { $sum: "$rating_star" },
      },
    },
  ]);

  const { totalReviews, averageRating, totalRatingStars } = reviewStats[0] || {
    totalReviews: 0,
    averageRating: 0,
    totalRatingStars: 0,
  };

  return {
    company,
    reviewStats: {
      totalReviews,
      averageRating,
      totalRatingStars,
    },
  };
}

export async function getAllCompanyForDropdown() {
  const companyList = await Company.find({ is_deleted: false })
    .select("_id name created_by")
    .populate("created_by");
  return companyList;
}

export async function deleteCompany(
  companyId: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId
) {
  const company = await Company.findOne({
    _id: companyId,
    created_by: createdBy,
  });

  if (!company) {
    throw new ApiError({
      message: "Company not found.",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  company.is_deleted = true;
  await company.save();

  return company;
}

export async function getCompanies({
  page,
  pageSize,
  categoryId,
  companyName,
}: {
  page: number;
  pageSize: number;
  companyName?: string;
  categoryId?: string;
}) {
  const offset = (page - 1) * pageSize;

  const searchFilter: any = companyName
    ? {
        name: { $regex: companyName, $options: "i" },
        is_deleted: false,
      }
    : {
        is_deleted: false,
      };

  if (categoryId) {
    searchFilter.category = categoryId;
  }

  const companies = await Company.find(searchFilter)
    .sort({ created_date: -1 })
    .skip(offset)
    .limit(pageSize)
    .exec();

  // Get the total count for pagination
  const totalCount = await Company.countDocuments(searchFilter);

  // Return paginated result
  return {
    currentPage: page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    data: companies,
  };
}

export async function getPopularCompaniesByReactions() {
  const popularCompanies = await Company.aggregate([
    // Lookup reviews for each company
    {
      $lookup: {
        from: "reviews", // MongoDB collection name for reviews
        localField: "_id",
        foreignField: "company",
        as: "reviews",
      },
    },
    // Filter out deleted companies
    {
      $match: {
        is_deleted: false,
      },
    },
    // Unwind reviews to calculate reactions
    {
      $unwind: {
        path: "$reviews",
        preserveNullAndEmptyArrays: false, // Exclude companies with no reviews
      },
    },
    // Filter out deleted reviews
    {
      $match: {
        "reviews.is_deleted": false,
      },
    },
    // Group by company and calculate total reactions
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" }, // Include company name
        cover_image: { $first: "$cover_image" }, // Include cover image
        totalReactions: { $sum: { $size: "$reviews.reactions" } },
      },
    },
    // Sort by total reactions in descending order
    {
      $sort: { totalReactions: -1 },
    },
    // Limit to top 24 companies
    {
      $limit: 24,
    },
  ]);

  return popularCompanies;
}
