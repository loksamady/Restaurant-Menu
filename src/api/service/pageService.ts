import { PAGES_ENDPOINT } from "@src/constant/site/constant";
import { get } from "../config";

export const getPages = async () => {
  const data = await get(`${PAGES_ENDPOINT}`);
  return data;
};

export const getPageDetail = async (id: number) => {
  const data = await get(`${PAGES_ENDPOINT}/${id}`);
  return data;
};
