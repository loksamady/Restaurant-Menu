import { BaseResponse } from "./response";

export type RoleType = {
  roleId: number | null;
  name: string | null;
};

export type RolesResponseType = BaseResponse<RoleType[]>;
export type RoleResponseType = BaseResponse<RoleType>;

