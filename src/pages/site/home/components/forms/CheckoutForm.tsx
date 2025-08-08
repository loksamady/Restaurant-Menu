import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import WebApp from "@twa-dev/sdk";
import { createOrderFromCart } from "@src/util/orderUtil";
import { orderStore } from "@src/state/order";
import { userStore } from "@src/state/store";
import {
  CreateCustomerSchemaType,
  CreateCustomerSchema,
} from "@src/validationType/customer";
import { CustomerInfo } from "@src/types/order";
import { registerCustomer } from "@src/api/service/site/customerRegistration.service";
import { useMutation } from "@tanstack/react-query";

interface CheckoutFormProps {
  onSubmit: (
    data: CreateCustomerSchemaType & {
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
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Get cart data and store actions
  const cartMenus = userStore((state) => state.menus);
  const clearCart = userStore((state) => state.clearCart);
  const addOrder = orderStore((state) => state.addOrder);

  // TanStack Query mutation for customer registration
  const customerRegistrationMutation = useMutation({
    mutationFn: registerCustomer,
    onSuccess: (response) => {
      console.log("Customer registered successfully:", response);
      if (response.data?.customerId) {
        toast.success(`Customer profile created with ID: ${response.data.customerId}`);
      }
    },
    onError: (error) => {
      console.error("Customer registration failed:", error);
      // Don't show error toast as the service already handles it
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<CreateCustomerSchemaType>({
    resolver: zodResolver(CreateCustomerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      phone_number: "",
      address: "",
      telegram_id: "",
      telegram_username: "",
    },
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
        setValue("telegram_id", user.id?.toString() || "");
        setValue("telegram_username", user.username || "");

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
        setValue("telegram_id", mockUser.id.toString());
        setValue("telegram_username", mockUser.username);

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
      setValue("telegram_id", mockUser.id.toString());
      setValue("telegram_username", mockUser.username);
      setIsReady(true);
    }
  }, [setValue]);

  const handleFormSubmit = async (data: CreateCustomerSchemaType) => {
    try {
      setIsSubmittingOrder(true);

      // Check if cart has items
      if (cartMenus.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      // Create customer info from form data
      const customerInfo: CustomerInfo = {
        name: data.username || telegramUser?.username || "Guest",
        phone: data.phone_number || "",
        email: "", // Not collected in this form
        address: data.address || "",
        notes: "", // Not collected in this form
        paymentMethod: "cash", // Default to cash, could be made configurable
      };

      // Create order from cart with customer info
      const newOrder = createOrderFromCart(cartMenus, customerInfo);

      // Add order to store
      addOrder(newOrder);

      // Prepare customer data for API submission (no order data)
      const customerRegistrationData = {
        username: data.username || telegramUser?.username || "Guest",
        phone: data.phone_number || "",
        address: data.address || "",
        telegramId: telegramUser?.id,
        telegramUsername: telegramUser?.username || data.telegram_username,
        profilePicture: telegramUser?.photo_url,
      };

      // Submit customer data to API (this runs in background, doesn't block UI)
      try {
        await customerRegistrationMutation.mutateAsync(customerRegistrationData);
      } catch (apiError) {
        // API error is already handled by the mutation, just log it
        console.warn("Customer API submission failed, but local order was saved:", apiError);
      }

      // Clear cart after successful order creation
      clearCart();

      // Combine form data with Telegram user data for the callback
      const completeData = {
        ...data,
        telegram_id: telegramUser?.id?.toString() || data.telegram_id || "",
        telegram_username:
          telegramUser?.username ||
          data.telegram_username ||
          data.username ||
          "",
        profile_picture: telegramUser?.photo_url,
      };

      console.log("Order created successfully:", newOrder);
      console.log("Customer data:", completeData);

      // Call the original onSubmit callback
      onSubmit(completeData);

      toast.success("Order submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit order");
      console.error("Checkout error:", error);
    } finally {
      setIsSubmittingOrder(false);
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
        {/* Display API submission status */}
        {customerRegistrationMutation.isError && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 text-sm">
              <i className="pi pi-exclamation-triangle mr-2"></i>
              Order saved locally, but customer profile submission failed. You can retry later.
            </p>
          </div>
        )}

        {customerRegistrationMutation.isSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              <i className="pi pi-check-circle mr-2"></i>
              Customer profile successfully created!
            </p>
          </div>
        )}

        {/* Username Field (Auto-filled from Telegram) */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <InputText
            id="username"
            {...register("username")}
            placeholder="Your username"
            className="w-full"
            disabled={isLoading || isSubmittingOrder}
            readOnly
          />
          {errors.username && (
            <small className="text-red-500 mt-1 block">
              {errors.username.message}
            </small>
          )}
        </div>

        {/* Hidden fields for Telegram data */}
        <input type="hidden" {...register("telegram_id")} />
        <input type="hidden" {...register("telegram_username")} />

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
            disabled={isLoading || isSubmittingOrder}
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
            disabled={isLoading || isSubmittingOrder}
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
          label={
            isSubmittingOrder
              ? customerRegistrationMutation.isPending
                ? "Creating Profile..."
                : "Processing Order..."
              : "Submit Order"
          }
          icon={
            isSubmittingOrder
              ? "pi pi-spin pi-spinner"
              : "pi pi-check"
          }
          className="w-full"
          disabled={
            !isValid || 
            isLoading || 
            isSubmittingOrder || 
            customerRegistrationMutation.isPending
          }
          loading={isSubmittingOrder || customerRegistrationMutation.isPending}
        />

        {/* API submission status info */}
        {customerRegistrationMutation.isPending && (
          <div className="text-center text-sm text-blue-600">
            <i className="pi pi-cloud-upload mr-1"></i>
            Creating customer profile...
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
