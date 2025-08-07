import { CUSTOMER_ENDPOINT } from "@src/constant/site/constant";
import { secureGet, securePost, securePut, secureRemove } from "../../config";
import {
  CreateCustomerType,
  UpdateCustomerType,
  CustomerResponseType,
  CustomersResponseType,
} from "@src/types/customer";
import { toastPromise } from "@src/util/toastUtil";
import { AdminMenuRequestParamType } from "@src/types/request";
/**
 * Get All Customers (Admin only)
 */
export const getCustomers = async (
  query?: AdminMenuRequestParamType
): Promise<CustomersResponseType> => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}`, query);
  return data;
};

/**
 * Get Customer by ID (Admin only)
 */
export const getCustomerById = async (
  customerId: number
): Promise<CustomerResponseType> => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/${customerId}`);
  return data;
};

/**
 * Create Customer (Admin only)
 */
export const createCustomer = async (customerData: CreateCustomerType) => {
  const data = securePost<CreateCustomerType>(
    `${CUSTOMER_ENDPOINT}`,
    customerData
  );

  if (data) toastPromise(data, "Customer created successfully!", true);

  return await data;
};

/**
 * Update Customer (Admin only)
 */
export const updateCustomer = async (
  customerId: number,
  updateData: UpdateCustomerType
) => {
  const data = securePut<UpdateCustomerType>(
    `${CUSTOMER_ENDPOINT}/${customerId}`,
    updateData
  );

  if (data) toastPromise(data, "Customer updated successfully!", true);

  return await data;
};

/**
 * Delete Customer (Admin only)
 */
export const deleteCustomer = async (customerId: number) => {
  const data = secureRemove(`${CUSTOMER_ENDPOINT}/${customerId}`);

  if (data) toastPromise(data, "Customer deleted successfully!", true);

  return await data;
};
