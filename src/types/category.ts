import { BaseResponse } from "./response";

export type CategoryType = {
  categoryId: number | null;
  nameEn: string | null;
  nameKh: string | null;
  nameCn: string | null;
  status: number | null;
  displayOrder: number | null;
  merchantId?: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CategoryOptionType = {
  categoryId: number;
  nameEn: string;
  merchantId: number;
};

export type CategoriesResponseType = BaseResponse<CategoryType[]>;
export type CategoryResponseType = BaseResponse<CategoryType>;
export type CategoryOptionsResponseType = BaseResponse<CategoryOptionType[]>;
