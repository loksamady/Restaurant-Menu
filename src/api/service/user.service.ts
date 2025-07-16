import { USER_ENDPOINT } from "@src/constant/admin/constant";
import { secureGet, securePost, securePut, secureRemove } from "../config";
import {
  CreateUserSchemaType,
  UpdateUserSchemaType,
} from "@src/validationType/user";
import { toastPromise } from "@src/util/toastUtil";
import { AdminMenuRequestParamType } from "@src/types/request";

export const getOwnerUsers = async () => {
  // console.log("heloo");

  const data = await secureGet(`${USER_ENDPOINT}/owners`);
  return data;
  // return null;
};

export const getUsers = async (query: AdminMenuRequestParamType) => {
  const data = await secureGet(`${USER_ENDPOINT}`, query);
  return data;
};

export const getUser = async (id: number) => {
  const data = await secureGet(`${USER_ENDPOINT}/${id}`);
  return data;
};

export const createUser = async (createUser: CreateUserSchemaType) => {
  const data = securePost<CreateUserSchemaType>(`${USER_ENDPOINT}`, createUser);

  if (data) toastPromise(data, "User has been created", true);

  return await data;
};

export const updateUser = async (
  id: number,
  updateUser: UpdateUserSchemaType
) => {
  const data = securePut<UpdateUserSchemaType>(
    `${USER_ENDPOINT}/${id}`,
    updateUser
  );

  if (data) toastPromise(data, "User has been updated", true);

  return await data;
};

export const deleteUser = async (id: number) => {
  const data = secureRemove(`${USER_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "User has been deleted");

  return await data;
};
