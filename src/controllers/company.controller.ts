import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { TUser } from "../models/user.model";
import * as companyService from "../services/company.service";

export async function getUsersCompanyList(req: Request, res: Response) {
  const user = req.user as TUser;

  const companyList = await companyService.getAllCompanyListOfUser(user._id);
  res.json({ data: companyList });
}

export async function getCompanyDropdown(_req: Request, res: Response) {
  const allCompanyList = await companyService.getAllCompanyForDropdown();
  res.json({ data: allCompanyList });
}

export async function getCompanyDetails(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });

  const company = await companyService.getCompanyById(params.companyId);
  res.json({ data: company });
}

export async function createCompany(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });
  const user = req.user as TUser;

  const company = await companyService.createCompany(user._id, {
    ...payload,
    created_by: user._id,
  });

  return res.json({ data: company, message: "Company created successfully." });
}

export async function updateCompany(req: Request, res: Response) {
  const payload = matchedData(req, { locations: ["body"] });
  const params = matchedData(req, { locations: ["params"] });
  const user = req.user as TUser;

  const company = await companyService.updateCompany(
    params.companyId,
    user._id,
    payload
  );

  return res.json({
    data: company,
    message: "Company's data successfully updated.",
  });
}

export async function deleteCompany(req: Request, res: Response) {
  const params = matchedData(req, { locations: ["params"] });
  const user = req.user as TUser;

  const company = await companyService.deleteCompany(
    params.companyId,
    user._id
  );

  res.json({ data: company, message: "Company deleted successfully." });
}
