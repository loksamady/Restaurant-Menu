import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import WebApp from "@twa-dev/sdk";
import { useMutation } from "@tanstack/react-query";
import { createCustomer } from "@src/api/service/site/customer.service";
import { CreateCustomerType } from "@src/types/customer";

// Validation schema - username, userid, phone and address required
const checkoutSchema = z.object({
  username: z.string().min(1, "Username is required"),
  userid: z.string().min(1, "User ID is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (
    data: CheckoutFormData & {
      telegram_id: string;
      telegram_username: string;
      profile_picture?: string;
    }
  ) => void;
  isLoading?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [telegramUser, setTelegramUser] = useState<{
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code?: string;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);

  // TanStack Query mutation for creating customer
  const createCustomerMutation = useMutation({
    mutationFn: async (
      checkoutData: CheckoutFormData & {
        telegram_id: string;
        telegram_username: string;
        profile_picture?: string;
      }
    ) => {
      // Map checkout data to customer creation format
      const customerData: CreateCustomerType = {
        firstName:
          telegramUser?.first_name ||
          checkoutData.username.split(" ")[0] ||
          "Telegram",
        lastName:
          telegramUser?.last_name ||
          checkoutData.username.split(" ").slice(1).join(" ") ||
          "User",
        email: `${checkoutData.telegram_username}@telegram.user`, // Generate email from telegram username
        password: `temp_${checkoutData.telegram_id}`, // Generate temporary password
        phone: checkoutData.phone_number,
        address: [checkoutData.address], // Address should be an array
      };

      console.log("Creating customer with data:", customerData);
      return await createCustomer(customerData);
    },
    onSuccess: (data) => {
      toast.success("Customer profile created successfully!");
      console.log("Customer created:", data);
    },
    onError: (error) => {
      toast.error("Failed to create customer profile");
      console.error("Customer creation error:", error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  });

  useEffect(() => {
    // Initialize Telegram WebApp
    try {
      WebApp.ready();
      WebApp.expand();

      // Get user data from Telegram
      const user = WebApp.initDataUnsafe?.user;

      if (user) {
        setTelegramUser(user);
        // Pre-fill form fields with Telegram data
        setValue(
          "username",
          user.username || `${user.first_name} ${user.last_name || ""}`.trim()
        );
        setValue("userid", user.id?.toString() || "");

        console.log("Telegram User Data:", user);
      } else {
        // Fallback mock data for development
        const mockUser = {
          id: 123456789,
          first_name: "John",
          last_name: "Doe",
          username: "johndoe",
          photo_url: undefined,
        };
        setTelegramUser(mockUser);
        setValue("username", mockUser.username);
        setValue("userid", mockUser.id.toString());

        console.log("Using mock data for development");
      }

      setIsReady(true);
    } catch (error) {
      console.error("Error initializing Telegram WebApp:", error);
      // Fallback for development
      const mockUser = {
        id: 123456789,
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        photo_url: undefined,
      };
      setTelegramUser(mockUser);
      setValue("username", mockUser.username);
      setValue("userid", mockUser.id.toString());
      setIsReady(true);
    }
  }, [setValue]);

  const handleFormSubmit = async (data: CheckoutFormData) => {
    try {
      // Combine form data with Telegram user data
      const completeData = {
        ...data,
        telegram_id: telegramUser?.id?.toString() || data.userid,
        telegram_username: telegramUser?.username || data.username,
        profile_picture: telegramUser?.photo_url,
      };

      console.log("Submitting checkout data:", completeData);

      // Create customer via API using TanStack Query
      await createCustomerMutation.mutateAsync(completeData);

      // Call the original onSubmit callback
      onSubmit(completeData);

      toast.success("Order submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit order");
      console.error("Checkout error:", error);
    }
  };

  // Show loading while Telegram data is being fetched
  if (!isReady) {
    return (
      <div className="p-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <i className="pi pi-spinner pi-spin text-2xl"></i>
        </div>
        <p className="text-gray-600">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Complete Your Order
      </h3>

      {/* Display Telegram User Info */}
      {telegramUser && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            Account Information
          </h4>
          <div className="space-y-1 text-sm">
            <p className="text-blue-700">
              <span className="font-medium">Name:</span>{" "}
              {telegramUser.first_name} {telegramUser.last_name || ""}
            </p>
            {telegramUser.username && (
              <p className="text-blue-700">
                <span className="font-medium">Username:</span> @
                {telegramUser.username}
              </p>
            )}
            <p className="text-blue-700">
              <span className="font-medium">User ID:</span> {telegramUser.id}
            </p>
            {telegramUser.language_code && (
              <p className="text-blue-700">
                <span className="font-medium">Language:</span>{" "}
                {telegramUser.language_code.toUpperCase()}
              </p>
            )}
            {telegramUser.photo_url && (
              <p className="text-blue-700">
                <span className="font-medium">Profile Picture:</span> Available
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Display API Error */}
        {createCustomerMutation.isError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              <i className="pi pi-exclamation-triangle mr-2"></i>
              {createCustomerMutation.error?.message ||
                "Failed to create customer profile"}
            </p>
          </div>
        )}

        {/* Phone Number Field */}
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium mb-1"
          >
            Phone Number *
          </label>
          <InputText
            id="phone_number"
            {...register("phone_number")}
            placeholder="Enter your phone number"
            className="w-full"
            disabled={isLoading}
          />
          {errors.phone_number && (
            <small className="text-red-500 mt-1 block">
              {errors.phone_number.message}
            </small>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Delivery Address *
          </label>
          <InputTextarea
            id="address"
            {...register("address")}
            placeholder="Enter your delivery address"
            rows={2}
            className="w-full"
            disabled={isLoading}
          />
          {errors.address && (
            <small className="text-red-500 mt-1 block">
              {errors.address.message}
            </small>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          label="Submit Order"
          icon="pi pi-check"
          className="w-full"
          disabled={!isValid || isLoading || createCustomerMutation.isPending}
          loading={isLoading || createCustomerMutation.isPending}
        />
      </form>
    </div>
  );
};

export default CheckoutForm;
