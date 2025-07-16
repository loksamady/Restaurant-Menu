
import { BaseResponse } from "./response";
import { UserType } from "./user";

export type AuthType = {
  token: string;
  user: UserType;
};

export type AuthTypeResponse = BaseResponse<AuthType>;
