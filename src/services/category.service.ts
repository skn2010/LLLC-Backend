import { UpdateQuery } from "mongoose";
import Category, { TCategory } from "../models/category.model";
import ApiError from "../utils/api-error.utils";
import getPaginatedData from "../utils/pagination.utils";
import { deleteFile } from "./backblaze.service";

export async function getCategoryList({
  page,
  pageSize,
  sortBy,
  sortOrder,
  search,
}: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: -1 | 1;
  search?: any;
}) {
  return await getPaginatedData<TCategory>(
    Category,
    page,
    pageSize,
    sortBy ? { fieldName: sortBy, sortOrder: sortOrder || 1 } : undefined,
    search?.trim() ? { name: search.trim() } : undefined
  );
}

export async function getCategoryDropdown() {
  const categories = await Category.find({ is_active: true }).select(
    "_id name"
  );

  return categories;
}

export async function getSingleCategory(categoryId: string) {
  const category = await Category.findById(categoryId).populate("created_by");

  if (!category) {
    throw new ApiError({
      message: "Category not found.",
      name: "NOT_FOUND_ERROR",
      statusCode: 404,
    });
  }

  return category;
}

export async function createCategory(payload: Partial<TCategory>) {
  const existingCategory = await Category.findOne({ name: payload.name });

  if (existingCategory) {
    if (payload.image) {
      deleteFile({
        fileId: payload.image.fileId,
        fileName: payload.image.fileName,
      }).catch((e) => {
        console.log(e, " IMAGE_DELETE_ERROR");
      });
    }

    throw new ApiError({
      message: "A category with the name  has already existed.",
      statusCode: 400,
      name: "VALIDATION_ERROR",
    });
  }

  const new_category: TCategory = new Category(payload);
  await new_category.save();
  return new_category;
}

export async function updateCategory(
  categoryId: string,
  categoryFields: UpdateQuery<TCategory>
) {
  const existingCategoryWithNewName = await Category.findOne({
    name: categoryFields.name,
  });

  if (existingCategoryWithNewName) {
    throw new ApiError({
      message: "A category with the name  has already existed.",
      statusCode: 400,
      name: "VALIDATION_ERROR",
    });
  }

  const categoryDetails = await Category.findById(categoryId);

  if (!categoryDetails) {
    throw new ApiError({
      message: "Category not found.",
      name: "NOT_FOUND_ERROR",
      statusCode: 404,
    });
  }

  if (
    categoryFields?.image &&
    categoryFields?.image?.url !== categoryDetails.image?.url
  ) {
    if (categoryDetails.image) {
      deleteFile({
        fileId: categoryDetails?.image.fileId,
        fileName: categoryDetails?.image.fileName,
      }).catch((e) => {
        console.log(e, " IMAGE_DELETE_ERROR");
      });
    }
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    categoryFields,
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new ApiError({
      message: "Category not found.",
      name: "NOT_FOUND_ERROR",
      statusCode: 404,
    });
  }

  if (categoryFields?.image?.url !== category.image?.url) {
  }

  return category;
}

export async function deleteCategory(catId: string) {
  const category = await Category.findByIdAndDelete(catId);

  if (!category) {
    throw new ApiError({
      message: "Category not found.",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  if (category.image) {
    deleteFile({
      fileId: category.image.fileId,
      fileName: category.image.fileName,
    }).catch((e) => {
      console.log(e, " IMAGE_DELETE_ERROR");
    });
  }

  return category;
}
