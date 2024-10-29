import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as service from "../services/menu.service";

export async function createMenu(req: Request, res: Response) {
  // Store the validated data in a payload attribute
  const payload = matchedData(req, { locations: ["body"] });
  payload.created_by = req?.user?._id;

  const response = await service.createMenu({ payload });
  return res.json({
    data: response,
    message: "Menu created successfully.",
  });
}

export async function updateMenu(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });
  payload.created_by = req.user?._id;

  const { menuId } = matchedData(req, {
    locations: ["params"],
  });

  const response = await service.updateMenu({
    params: { menuId },
    payload,
    auth: { user: req.user },
  });

  return res.json({
    data: response,
    message: "Menu updated successfully.",
  });
}

export async function deleteMenu(req: Request, res: Response) {
  const { menuId } = matchedData(req, {
    locations: ["params"],
  });

  const response = await service.deleteMenu({
    params: { menuId },
    auth: { user: req.user },
  });

  return res.json({ data: response, message: "Menu updated successfully." });
}

export async function getMenu(req: Request, res: Response) {
  const { menuId } = matchedData(req, {
    locations: ["params"],
  });

  const resData = await service.getMenu({ params: { menuId } });
  return res.json({ data: resData });
}

export async function getMenusOfCompany(req: Request, res: Response) {
  const { companyId } = matchedData(req, {
    locations: ["params"],
  });
  const { page, pageSize, search } = matchedData(req, {
    locations: ["query"],
  });

  const data = await service.getMenusOfCompany({
    params: { companyId },
    queries: { page, pageSize, search },
  });

  return res.json(data);
}

export async function getMenusOfCompanyDropdown(req: Request, res: Response) {
  const { companyId } = matchedData(req, {
    locations: ["params"],
  });

  const data = await service.getMenusDropdownOfCompany({
    params: { companyId },
  });

  return res.json(data);
}
