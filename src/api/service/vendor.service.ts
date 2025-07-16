import { VENDOR_ENDPOINT } from "@src/constant/admin/constant";
import { secureGet, securePost, securePut, secureRemove } from "../config";
import {
  VendorDetailResponseType,
  VendorListResponseType,
} from "@src/types/admin/vendor";
import { toastPromise } from "@src/util/toastUtil";
import {
  CreateVendorSchemaType,
  UpdateVendorSchemaType,
} from "@src/validationType/vendor";

export const getVendors = async (): Promise<VendorListResponseType> => {
  const data = await secureGet(`${VENDOR_ENDPOINT}`);
  return data;
};

export const getVendor = async (
  id: number
): Promise<VendorDetailResponseType> => {
  const data = await secureGet(`${VENDOR_ENDPOINT}/${id}`);
  return data;
};

export const createVendor = async (body: CreateVendorSchemaType) => {
  const data = securePost<CreateVendorSchemaType>(`${VENDOR_ENDPOINT}`, body);

  if (data) toastPromise(data, "Vendor has been created");

  return await data;
};

export const updateVendor = async (
  id: number,
  body: UpdateVendorSchemaType
) => {
  const data = securePut<UpdateVendorSchemaType>(
    `${VENDOR_ENDPOINT}/${id}`,
    body
  );

  if (data) toastPromise(data, "Vendor has been updated");

  return await data;
};

export const deleteVendor = async (id: number) => {
  const data = secureRemove(`${VENDOR_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "Vendor has been deleted");

  return await data;
};
