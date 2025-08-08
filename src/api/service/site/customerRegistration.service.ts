import { CUSTOMER_REGISTER_ENDPOINT } from "@src/constant/site/constant";
import { post, remove } from "../../config";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { toastPromise } from "@src/util/toastUtil";
// Public customer registration data type (customer data only)
export interface PublicCustomerRegistration {
  username: string;
  phone_number: string; // Changed from 'phone' to match database schema
  address: string;
  telegramId?: number;
  telegramUsername?: string;
  profilePicture?: string;
}

export interface CustomerRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    customerId: number;
  };
}

/**
 * Register a new customer (Public endpoint - no auth required)
 */
export const registerCustomer = async (
  customerData: PublicCustomerRegistration
): Promise<CustomerRegistrationResponse> => {
  try {
    // Comprehensive validation before sending to API
    if (
      !customerData.phone_number ||
      typeof customerData.phone_number !== "string" ||
      customerData.phone_number.trim().length === 0
    ) {
      throw new Error("Phone number is required and cannot be empty");
    }

    if (
      !customerData.username ||
      typeof customerData.username !== "string" ||
      customerData.username.trim().length === 0
    ) {
      throw new Error("Username is required and cannot be empty");
    }

    // Clean and validate phone number
    const cleanedPhoneNumber = customerData.phone_number.trim();
    if (cleanedPhoneNumber.length < 5) {
      throw new Error("Phone number must be at least 5 characters long");
    }

    // Clean and validate username
    const cleanedUsername = customerData.username.trim();
    if (cleanedUsername.length < 2) {
      throw new Error("Username must be at least 2 characters long");
    }

    // Clean the data before sending - ensure no null or undefined values
    const cleanedData: PublicCustomerRegistration = {
      username: cleanedUsername,
      phone_number: cleanedPhoneNumber,
      address: customerData.address?.trim() || "",
      telegramId: customerData.telegramId || undefined,
      telegramUsername: customerData.telegramUsername?.trim() || undefined,
      profilePicture: customerData.profilePicture?.trim() || undefined,
    };

    // Final validation - ensure all required fields are present and not empty
    if (!cleanedData.username || !cleanedData.phone_number) {
      throw new Error(
        "Required fields (username, phone_number) cannot be empty after cleaning"
      );
    }

    console.log("Sending customer data to API:", cleanedData);

    const response = await post<PublicCustomerRegistration>(
      CUSTOMER_REGISTER_ENDPOINT,
      cleanedData
    );

    if (response) {
      toast.success("Customer profile created successfully!");
    }

    return response;
  } catch (error) {
    console.error("Customer registration error:", error);

    // Handle specific HTTP status codes
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 409) {
        // Conflict - customer already exists
        const responseData = axiosError.response?.data as
          | { message?: string }
          | undefined;
        const message = responseData?.message || "Customer already exists";
        console.log("Customer already exists - this is expected:", message);

        toast.info("Customer profile already exists in our system");

        // Return a success-like response for existing customers - DON'T throw error
        return {
          success: true,
          message: "Customer already exists",
          data: {
            customerId: 0, // We don't have the actual ID, but indicate success
          },
        };
      }

      if (axiosError.response?.status === 400) {
        // Bad request - validation error
        const responseData = axiosError.response?.data as
          | { message?: string }
          | undefined;
        const message = responseData?.message || "Invalid customer data";
        toast.error(`Validation error: ${message}`);
      } else if (axiosError.response && axiosError.response.status >= 500) {
        // Server error
        toast.error("Server error. Please try again later.");
      } else {
        // Other HTTP errors
        toast.error("Failed to create customer profile");
      }
    } else if (error instanceof Error) {
      // Client-side validation errors
      if (error.message.includes("Phone number is required")) {
        toast.error("Phone number is required to create customer profile");
      } else if (error.message.includes("Username is required")) {
        toast.error("Username is required to create customer profile");
      } else {
        toast.error("Failed to create customer profile");
      }
    } else {
      toast.error("Failed to create customer profile");
    }

    throw error;
  }
};

export const deleteCustomer = async (id: number) => {
  const data = remove(`${CUSTOMER_REGISTER_ENDPOINT}/${id}`);

  if (data) toastPromise(data, "Customer has been deleted");

  return await data;
};
