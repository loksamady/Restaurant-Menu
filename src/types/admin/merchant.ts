import { FileType } from "../file";
import { BaseResponse } from "../response";

export type MerchantType = {
  id: number;
  name: string;
  primaryPhone: string;
  secondaryPhone: string;
  slug: string;
  active: boolean;
  vendorId: number | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MerchantDetailType = MerchantType & {
  address: string;
  titleEn: string;
  titleKh: string;
  titleCn: string;
  subtitleEn: string;
  subtitleKh: string;
  subtitleCn: string;
  descriptionEn: string;
  descriptionKh: string;
  descriptionCn: string;
  location: string;
  logo: string;
  banners: FileType[];
  logoUrl: string;
  openTime: string;
  closeTime: string;
  telegram: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export type MerchantOptionType = {
  id: number;
  name: string;
};

export type MerchantAuthType = MerchantOptionType & {
  vendorId: number;
  active?: boolean;
};

export type MerchantThemeType = {
  id: number;
  merchantId: number;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MerchantListResponseType = BaseResponse<MerchantType[]>;
export type MerchantDetailResponseType = BaseResponse<MerchantDetailType>;
export type MerchantOptionResponseType = BaseResponse<MerchantOptionType[]>;
export type MerchantAuthResponseType = BaseResponse<MerchantAuthType[]>;
export type MerchantThemeResponseType = BaseResponse<MerchantThemeType>;
