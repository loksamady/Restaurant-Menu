import {
  ADMIN_MENU_ENDPOINT,
  ADMIN_MENU_FILE_ENDPOINT,
} from "@src/constant/admin/constant";
import {
  secureGet,
  securePostFormData,
  securePutFormData,
  secureRemove,
} from "../config";
import { CreateMenuSchemaType } from "@src/validationType/menu";
import { toastPromise } from "@src/util/toastUtil";
import { AdminMenuRequestParamType } from "@src/types/request";

export const getMenus = async (query: AdminMenuRequestParamType) => {
  const data = await secureGet(`${ADMIN_MENU_ENDPOINT}`, query);
  return data;
};

export const getMenu = async (id: number) => {
  const data = await secureGet(`${ADMIN_MENU_ENDPOINT}/${id}`);
  return data;
};

export const createMenu = async (createMenu: CreateMenuSchemaType) => {
  const data = securePostFormData<CreateMenuSchemaType>(
    `${ADMIN_MENU_ENDPOINT}`,
    createMenu
  );

  if (data) toastPromise(data, "Menu has been created", true);

  return await data;
};

export const updateMenu = async (
  id: number,
  updateMenu: CreateMenuSchemaType
) => {
  const data = securePutFormData<CreateMenuSchemaType>(
    `${ADMIN_MENU_ENDPOINT}/${id}`,
    updateMenu
  );

  if (data) toastPromise(data, "Menu has been updated", true);

  return await data;
};

export const deleteMenu = async (id: number) => {
  const data = secureRemove(`${ADMIN_MENU_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "Menu has been deleted");

  return await data;
};

export const deleteMenuFile = async (id: number) => {
  const data = secureRemove(`${ADMIN_MENU_FILE_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "Menu Image has been deleted");

  return await data;
};
