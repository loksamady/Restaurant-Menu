import { BaseResponse } from "./response";

export type PageType = {
  id: number | string;
  parentId: number | null;
  childPages: PageType[];
  titleEn: string | null;
  titleKh: string | null;
  url: string | null;
  path: string | null;
  descriptionEn: string | null;
  descriptionKh: string | null;
  displayOrder: number | null;
  order: number | null;
  status: number | null;
  pageComponent: string | null;
  parameter: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PageTypesResponse = BaseResponse<PageType[]>;
export type PageTypeResponse = BaseResponse<PageType>;
