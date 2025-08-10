import { CUSTOMER_REGISTER_ENDPOINT } from "@src/constant/site/constant";
import { post, remove } from "../../config";
import { toastPromise } from "@src/util/toastUtil";
// Public customer registration data type (customer data only)
export type PublicCustomerRegistration = {
  username: string;
  phone_number: string; // Changed from 'phone' to match database schema
  address: string;
  telegram_id?: string;
  telegram_username?: string;
  profile_picture?: string;
};
export const registerCustomer = async (
  registerCustomer: PublicCustomerRegistration
) => {
  const data = await post<PublicCustomerRegistration>(
    CUSTOMER_REGISTER_ENDPOINT,
    registerCustomer
  );
  // If backend returns empty, fallback to a default success object
  if (data === undefined || data === null) {
    return { success: true, message: "Customer registered (empty response)" };
  }
  return data;
};

export const deleteCustomer = async (id: number) => {
  const data = remove(`${CUSTOMER_REGISTER_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "Customer has been deleted");

  return await data;
};
// Fetch customer by phone
export const getCustomer = async (phone_number: string) => {
  try {
    console.log(
      "[getCustomer] Fetching customer with phone number:",
      phone_number
    );
    const response = await fetch(
      `${CUSTOMER_REGISTER_ENDPOINT}/${phone_number}`
    );
    console.log("[getCustomer] Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[getCustomer] Error response:", errorText);
      throw new Error("Failed to fetch customer");
    }
    const data = await response.json();
    console.log("[getCustomer] Response data:", data);
    return data;
  } catch (error) {
    console.error("[getCustomer] Exception:", error);
    return null;
  }
};
