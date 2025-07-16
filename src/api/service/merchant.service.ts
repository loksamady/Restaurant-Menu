import { MERCHANT_ENDPOINT } from "@src/constant/admin/constant";
import {
  secureGet,
  securePostFormData,
  securePut,
  securePutFormData,
  secureRemove,
} from "../config";
import {
  MerchantAuthResponseType,
  MerchantDetailResponseType,
  MerchantListResponseType,
  MerchantOptionResponseType,
  MerchantThemeResponseType,
} from "@src/types/admin/merchant";
import { toastPromise } from "@src/util/toastUtil";
import { MerchantThemeSchemaType } from "@src/validationType/merchant";

export const getMerchants = async (): Promise<MerchantListResponseType> => {
  const data = await secureGet(`${MERCHANT_ENDPOINT}`);
  return data;
};

export const getAuthMerchants = async (): Promise<MerchantAuthResponseType> => {
  const data = await secureGet(`${MERCHANT_ENDPOINT}/auth`);
  return data;
};

export const getMerchantOptions =
  async (): Promise<MerchantOptionResponseType> => {
    const data = await secureGet(`${MERCHANT_ENDPOINT}/options`);
    return data;
  };

export const getMerchant = async (
  id: number
): Promise<MerchantDetailResponseType> => {
  const data = await secureGet(`${MERCHANT_ENDPOINT}/${id}`);
  return data;
};

export const createMerchant = async (body: FormData) => {
  const data = securePostFormData<FormData>(`${MERCHANT_ENDPOINT}`, body);

  if (data) toastPromise(data, "Merchant has been created");

  return await data;
};

export const updateMerchant = async (id: number, body: FormData) => {
  const data = securePutFormData<FormData>(`${MERCHANT_ENDPOINT}/${id}`, body);

  if (data) toastPromise(data, "Merchant has been updated");

  return await data;
};

export const deleteMerchant = async (id: number) => {
  const data = secureRemove(`${MERCHANT_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "Merchant has been deleted");

  return await data;
};

export const deleteMerchantFile = async (id: number) => {
  const data = secureRemove(`${MERCHANT_ENDPOINT}/file/${id}`);

  if (data) toastPromise(data, "Merchant Banner has been deleted");

  return await data;
};

export const getMerchantTheme = async (
  id: number
): Promise<MerchantThemeResponseType> => {
  const data = await secureGet(`${MERCHANT_ENDPOINT}/theme/${id}`);
  return data;
};

export const updateMerchantTheme = async (
  id: number,
  body: MerchantThemeSchemaType
) => {
  const data = securePut<MerchantThemeSchemaType>(
    `${MERCHANT_ENDPOINT}/theme/${id}`,
    body
  );

  if (data) toastPromise(data, "Merchant Theme has been updated");

  return await data;
};
