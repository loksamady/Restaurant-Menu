import { BaseResponse } from "../response";
import { UserDetailType } from "../user";
import { MerchantType } from "./merchant";

export type VendorType = {
  id: number;
  name: string;
  period: number;
  price: number;
  discount: number;
  merchantLimit: number;
  status: boolean;
  merchants: MerchantType[];
  users: UserDetailType[];
  createdAt: string;
  updatedAt: string;
};

export type VendorDetailType = VendorType;

export type VendorOptionType = {
  id: number;
  name: string;
};

export type VendorAuthType = VendorOptionType & {
  merchantLimit: number;
  status: boolean;
};

export type VendorListResponseType = BaseResponse<VendorType[]>;
export type VendorDetailResponseType = BaseResponse<VendorDetailType>;
export type VendorOptionResponseType = BaseResponse<VendorOptionType[]>;
