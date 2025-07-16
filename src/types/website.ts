import { MerchantThemeType } from "./admin/merchant";
import { FileType } from "./file";
import { BaseResponse } from "./response";

export type MerchantType = {
  id: number;
  name: string;
  primaryPhone: string;
  secondaryPhone: string;
  location: string;
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
  logo: string;
  banners: FileType[];
  logoUrl: string;
  openTime: string;
  closeTime: string;
  slug: string;
  telegram: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  active: boolean;
};

export type CategoryType = {
  categoryId: number;
  nameEn: string;
  nameKh: string;
  nameCn: string;
  status: number;
  createdAt: string | null;
  updatedAt: string | null;
  displayOrder: number;
  merchantId: number | null;
  menus?: MenuType[];
};

export type MenuFileType = {
  menuFileId: number;
  fileName: string;
  filePath?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  main: boolean;
};

export type MenuType = {
  menuId: number;
  code: string;
  nameEn: string;
  nameKh: string;
  nameCn: string;
  descriptionEn: string;
  descriptionKh: string;
  descriptionCn: string;
  price: number;
  priceKh: number;
  discount: number;
  status: number;
  merchantId: number | null;
  categories: CategoryType[];
  files: MenuFileType[];
  createdAt: string | null;
  updatedAt: string | null;
  hot: boolean;
};

export type WebsiteType = {
  merchant: MerchantType | null;
  merchantTheme: MerchantThemeType | null;
  categories: CategoryType[];
  menus: MenuType[];
};

export type WebsiteTypeResponse = BaseResponse<WebsiteType>;
