import { CategoryType } from "./category";
import { BaseResponse } from "./response";

export type MenuType = {
  menuId: number | null;
  nameEn: string | null;
  nameKh: string | null;
  nameCn: string | null;
  code: string | null;
  descriptionEn: string | null;
  descriptionKh: string | null;
  descriptionCn: string | null;
  price: number | null;
  priceKh: number | null;
  discount: number | null;
  status: number | null;
  categories: CategoryType[]; // ← You may define this type
  files: MenuFileType[]; // ← You may define this type
  hot: boolean; // ← You may define this type
  merchantId?: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MenuFileType = {
  menuFileId: number | null;
  fileName: string | null;
  main: boolean | null;
  fileUrl?: string | null;
};

export type NavMenuType = {
  id?: string;
  label?: string;
  items?: NavMenuType[];
  isOutSourceUrl?: boolean;
  url?: string;
};

export type MenusResponseType = BaseResponse<MenuType[]>;
export type MenuResponseType = BaseResponse<MenuType>;
