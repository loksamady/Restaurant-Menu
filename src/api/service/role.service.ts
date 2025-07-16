import { ROLE_ENDPOINT } from "@src/constant/admin/constant";
import { secureGet } from "../config";
import { RolesResponseType } from "@src/types/role";

export const getRoles = async (): Promise<RolesResponseType> => {
  const data = await secureGet(`${ROLE_ENDPOINT}`);
  return data;
};
