import { WebsiteTypeResponse } from "./../../types/website";
import { secureGet } from "./../config/index";
import { WEBSITE_V1 } from "./../../constant/site/constant";

export const getWebsiteData = async (
  slug: string
): Promise<WebsiteTypeResponse> => {
  const data = await secureGet(`${WEBSITE_V1}/${slug}`);
  return data;
};
