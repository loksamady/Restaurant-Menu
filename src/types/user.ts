import { MerchantAuthType } from "./admin/merchant";
import { VendorAuthType } from "./admin/vendor";
import { BaseResponse } from "./response";
import { RoleType } from "./role";

export type UserType = {
  userId: number;
  username: string;
  roles: RoleType[];
  // enabled: boolean;
  isBaseOwner?: number | null;
  // accountNonExpired: boolean;
  // credentialsNonExpired: boolean;
  // accountNonLocked: boolean;
  merchantId?: number | null;
  vendorId?: number | null;
  merchants: MerchantAuthType[];
  vendor: VendorAuthType;
};

export type UserDetailType = {
  userId: number;
  username: string;
  isBaseOwner: number;
  vendorId: number;
  status: boolean;
  merchantId: number | null;
  referralId: string | null;
  roles: RoleType[];
  createdAt: string | null;
  updatedAt: string | null;
};

export type UsersResponseType = BaseResponse<UserType[]>;
export type UserResponseType = BaseResponse<UserType>;
