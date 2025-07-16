/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "@src/state/auth";
import axios from "axios";
import { toast } from "sonner";

export const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const responseError = error.response?.data?.error;
    if (responseError === "Your token has expired. Please login again.") {
      useAuthStore.getState().logout();
      toast.error("Your Session Expired!");
    }

    const responseErrors = error.response?.data.errors;
    if (responseErrors) {
      const errorMessages = Object.entries(responseErrors || {})
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
      toast.error(errorMessages);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    error.response?.status == 404
      ? console.log("Not Found")
      : console.log("Axios error:", error.response?.data || error.message);
  } else {
    console.log("Error:", error);
    toast.error("An unknown error occurred");
  }
};

export const handleError = (error: any, checkConflict?: boolean): string => {
  try {
    const errorStatus = error.response?.data.status;
    const errorMessage = error.response?.data.error;
    const errors = error.response?.data.errors;
    const errorMessages = Object.entries(errors || {})
      .map(([field, message]) => `${field}: ${message}`)
      .join(", ");

    if (errorStatus === 401) return "Unauthorized";

    if (errorStatus === 403) return "Forbidden";

    if (errorStatus === 404) return "Not Found";

    if (checkConflict && errorStatus === 409) return "Already Existed";

    if (errorStatus === 500) return "Internal Server Error";

    return `[${errorStatus}] ${
      errorMessages || errorMessage || "An unknown error occurred."
    }`;
  } catch {
    return "Something went wrong";
  }
};
