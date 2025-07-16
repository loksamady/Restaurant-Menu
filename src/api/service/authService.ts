import { AUTH_V1_LOGIN, AUTH_V1_PROFILE } from "@src/constant/auth/constant";
import {
  LoginSchemaType,
  UpdateAuthSchemaType,
} from "@src/validationType/user";
import { post, securePut } from "../config";
import { toast } from "sonner";
import { toastPromise } from "@src/util/toastUtil";

export const login = async (loginRequest: LoginSchemaType) => {
  const data = post<LoginSchemaType>(AUTH_V1_LOGIN, loginRequest);

  if (data) {
    toast.promise(data, {
      loading: "Loading...",
      success: async (data) => data.message,
    });
  }

  return await data;
};

export const updateAuthUser = async (updateUser: UpdateAuthSchemaType) => {
  const data = securePut<UpdateAuthSchemaType>(
    `${AUTH_V1_PROFILE}`,
    updateUser
  );

  if (data) toastPromise(data, "Profile has been updated");

  return await data;
};
