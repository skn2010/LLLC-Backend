import Company from "../models/company.model";
import Menu, { TMenu } from "../models/menu.model";
import { TUser } from "../models/user.model";
import ApiError from "../utils/api-error.utils";

export async function getMenu({ params }: { params: { menuId: string } }) {
  const menu = await Menu.findById(params.menuId).populate(
    "created_by company"
  );
  if (!menu || menu.is_deleted) {
    throw new ApiError({
      message: "Menu with the provided id not found",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  return menu;
}

export async function getMenusDropdownOfCompany({
  params,
}: {
  params: { companyId: string };
}) {
  const menus = await Menu.find({
    company: params.companyId,
    is_deleted: false,
  }).select("_id name");

  return menus;
}

export async function getMenusOfCompany({
  params,
  queries,
}: {
  params: {
    companyId: string;
  };
  queries: {
    page: number;
    pageSize: number;
    search?: string;
  };
}) {
  const { companyId } = params;
  const { page = 1, pageSize = 10, search } = queries;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  // Build the search filter if provided
  const searchFilter = search
    ? {
        name: { $regex: search, $options: "i" },
        company_id: companyId,
        is_deleted: false,
      }
    : { company_id: companyId, is_deleted: false };

  // Query the database for menus with pagination
  const menus = await Menu.find(searchFilter)
    .sort({ created_date: -1 }) // Sort by created_date in descending order
    .skip(offset)
    .limit(pageSize)
    .exec();

  // Get the total count for pagination
  const totalCount = await Menu.countDocuments(searchFilter);

  // Return paginated result
  return {
    currentPage: page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    data: menus,
  };
}

export async function createMenu({ payload }: { payload: Partial<TMenu> }) {
  // Check if this company is originally owned by this user or not
  const company = await Company.findById(payload.company);

  if (
    !company ||
    company.created_by?.toString() !== payload.created_by?.toString()
  ) {
    throw new ApiError({
      message: "You do not own this company.",
      statusCode: 400,
      name: "AUTHORIZATION_ERROR",
    });
  }

  const existedMenu = await Menu.findOne({
    name: payload.name,
    company: payload.company,
  });

  if (existedMenu) {
    throw new ApiError({
      message: "Menu with this name has already existed.",
      statusCode: 400,
      name: "VALIDATION_ERROR",
    });
  }

  // Let's add this menu
  const newMenu = new Menu(payload);
  await newMenu.save();
  return newMenu;
}

export async function updateMenu({
  payload,
  params,
  auth,
}: {
  payload: Partial<TMenu>;
  params: { menuId: string };
  auth: { user?: TUser };
}) {
  if (!auth.user) {
    throw new ApiError({
      message: "Authentication required",
      statusCode: 400,
      name: "VALIDATION_ERROR",
    });
  }

  const menu = await Menu.findById(params.menuId);

  if (!menu || menu.is_deleted) {
    throw new ApiError({
      message: "Menu with the provided id not found",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  // Object level permission: only admin or creator of this menu can update the menu
  const isCreator = menu.created_by.toString() === auth.user._id.toString();
  const isAdmin = auth.user.is_admin;

  if (!isCreator && !isAdmin) {
    throw new ApiError({
      message: "You are not allowed to access or modify this menu.",
      statusCode: 401,
      name: "AUTHORIZATION_ERROR",
    });
  }

  // Update the menu
  await menu.updateOne(payload, {
    new: true,
    runValidators: true,
  });

  return menu; // Optionally return the updated menu
}

export async function deleteMenu({
  params,
  auth,
}: {
  params: { menuId: string };
  auth: { user?: TUser };
}) {
  const menu = await Menu.findById(params.menuId);

  if (!menu || menu.is_deleted) {
    throw new ApiError({
      message: "Menu with the provided id not found",
      statusCode: 404,
      name: "NOT_FOUND_ERROR",
    });
  }

  const isCreator = menu.created_by.toString() === auth.user?._id.toString();
  const isAdmin = auth.user?.is_admin;

  if (!isCreator && !isAdmin) {
    throw new ApiError({
      message: "You are not allowed to access or modify this menu.",
      statusCode: 401,
      name: "AUTHORIZATION_ERROR",
    });
  }

  menu.is_deleted = true;
  await menu.save();

  return menu;
}
