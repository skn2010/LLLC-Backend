import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as categoryServices from "../services/category.service";

export async function getCategoryList(req: Request, res: Response) {
  const sanitizedData = matchedData(req);

  const data = await categoryServices.getCategoryList({
    page: sanitizedData.page,
    pageSize: sanitizedData.pageSize,
    sortBy: sanitizedData?.sortBy,
    sortOrder: Number(sanitizedData?.sortOrder || 1) as 1 | -1,
    search: sanitizedData?.search,
  });

  return res.json(data);
}

export async function getCategoryDropdown(req: Request, res: Response) {
  const categories = await categoryServices.getCategoryDropdown();
  return res.json({ data: categories });
}

export async function getSingleCategory(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });
  const category = await categoryServices.getSingleCategory(params.categoryId);
  return res.json({ data: category });
}

export async function createCategory(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });

  const category = await categoryServices.createCategory({
    ...payload,
    created_by: req.user,
  });

  return res.json({
    data: category,
    message: "Category created successfully.",
  });
}

export async function updateCategory(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });
  const params = matchedData(req, { locations: ["params"] });

  const category = await categoryServices.updateCategory(
    params.categoryId,
    payload
  );

  return res.json({
    data: category,
    message: "Category updated successfully.",
  });
}

export async function deleteCategory(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });

  const category = await categoryServices.deleteCategory(params.categoryId);

  return res.json({
    data: category,
    message: "Category deleted successfully.",
  });
}
