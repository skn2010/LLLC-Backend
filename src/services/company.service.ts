import mongoose from "mongoose";
import Company, { TCompany } from "../models/company.model";
import ApiError from "../utils/api-error.utils";

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
  if (payload?.name) {
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
  }

  // Let's update
  const company = await Company.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!company || company.is_deleted) {
    throw new ApiError({
      message: "Company not found.",
      name: "NOT_FOUND_ERROR",
      statusCode: 404,
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

  return company;
}

export async function getAllCompanyForDropdown() {
  const companyList = await Company.find({ is_deleted: false })
    .select("_id name created_by")
    .populate("created_by", "_id name address");
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
