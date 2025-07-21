import { ADMIN_CATEGORY_ENDPOINT } from "@src/constant/admin/constant";
import { secureGet, securePost, securePut, secureRemove } from "../config";
import { CreateCategorySchemaType } from "@src/validationType/category";
import { toastPromise } from "@src/util/toastUtil";
import { AdminMenuRequestParamType } from "@src/types/request";

export const getAdminCategories = async (query: AdminMenuRequestParamType) => {
  const data = await secureGet(`${ADMIN_CATEGORY_ENDPOINT}`, query);
  return data;
};

export const getAdminCategoryOptions = async () => {
  const data = await secureGet(`${ADMIN_CATEGORY_ENDPOINT}/options`);
  return data;
};

export const getAdminCategory = async (id: number) => {
  const data = await secureGet(`${ADMIN_CATEGORY_ENDPOINT}/${id}`);
  return data;
};

export const createCategory = async (createCategory: CreateCategorySchemaType) => {
  const data = securePost<CreateCategorySchemaType>(`${ADMIN_CATEGORY_ENDPOINT}`,createCategory);

  if (data) toastPromise(data, "Category Image has been created", true);

  return await data;
};

export const updateCategory = async (
  id: number,
  updateCategory: CreateCategorySchemaType
) => {
  const data = securePut<CreateCategorySchemaType>(
    `${ADMIN_CATEGORY_ENDPOINT}/${id}`,
    updateCategory
  );

  if (data) toastPromise(data, "Category Image has been updated", true);

  return await data;
};

export const deleteCategory = async (id: number) => {
  const data = secureRemove(`${ADMIN_CATEGORY_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "Category Image has been deleted");

  return await data;
};
