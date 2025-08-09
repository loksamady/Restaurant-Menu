// ...existing code...
import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import useCheckoutForm from "./useCheckoutForm";
// ...existing code...

// No props needed
// ...existing code...

const CheckoutForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmittingOrder,
    isReady,
    customerRegistrationMutation,
    telegramUser,
    handleFormSubmit,
  } = useCheckoutForm();

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
  // Submission handled in useCheckoutForm

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Complete Your Order
      </h3>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Display API submission status */}
        {customerRegistrationMutation.isError && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 text-sm">
              <i className="pi pi-exclamation-triangle mr-2"></i>
              Order saved locally, but customer profile submission failed. You
              can retry later.
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
        {/* Profile Picture Preview (from Telegram) */}
        {telegramUser?.profile_picture && (
          <div className="mb-2 flex items-center">
            <img
              src={telegramUser.profile_picture}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-3 border"
            />
            <span className="text-sm text-gray-700">
              Profile picture from Telegram
            </span>
          </div>
        )}
        <input
          type="file"
          id="profile_image"
          style={{ display: "none" }}
          accept="image/*"
        />
        {/* Name Field (Read-only, direct from Telegram Mini App) */}
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium mb-1"
          >
            Name *
          </label>
          <InputText
            id="first_name"
            value={telegramUser?.first_name || ""}
            className="w-full"
            disabled={true}
            readOnly
          />
          {!telegramUser?.first_name && (
            <small className="text-orange-500 mt-1 block">
              Unable to get your name from Telegram Mini App. Please check your
              Telegram profile.
            </small>
          )}
          {telegramUser?.first_name && (
            <small className="text-gray-500 mt-1 block">
              Name fetched directly from Telegram Mini App
            </small>
          )}
        </div>

        {/* Telegram ID Field */}
        <div>
          <label
            htmlFor="telegram_id"
            className="block text-sm font-medium mb-1"
          >
            Telegram ID
          </label>
          <InputText
            id="telegram_id"
            {...register("telegram_id")}
            placeholder="Your Telegram ID"
            className="w-full"
            disabled={true}
            defaultValue={telegramUser?.id?.toString() || ""}
          />
          {errors.telegram_id && (
            <small className="text-red-500 mt-1 block">
              {errors.telegram_id.message}
            </small>
          )}
        </div>

        {/* Telegram Username Field */}
        <div>
          <label
            htmlFor="telegram_username"
            className="block text-sm font-medium mb-1"
          >
            Telegram Username
          </label>
          <InputText
            id="telegram_username"
            {...register("telegram_username")}
            placeholder="Your Telegram Username"
            className="w-full"
            disabled={true}
            defaultValue={telegramUser?.username || ""}
          />
          {errors.telegram_username && (
            <small className="text-red-500 mt-1 block">
              {errors.telegram_username.message}
            </small>
          )}
        </div>

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
            disabled={isSubmittingOrder}
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
            disabled={isSubmittingOrder}
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
          icon={isSubmittingOrder ? "pi pi-spin pi-spinner" : "pi pi-check"}
          className="w-full"
          disabled={false}
          loading={isSubmittingOrder || customerRegistrationMutation.isPending}
        />
        {/* Debug info for button state */}
        <div className="mt-2 text-xs text-gray-500">
          <div>isValid: {String(isValid)}</div>
          <div>isSubmittingOrder: {String(isSubmittingOrder)}</div>
          <div>isPending: {String(customerRegistrationMutation.isPending)}</div>
        </div>

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
