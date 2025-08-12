import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { toast } from "sonner";
import useCheckoutForm from "./useCheckoutForm";
import UserProfile from "@src/pages/site/home/components/customer/UserProfile";
import { userStore } from "@src/state/store";

interface CheckoutFormProps {
  onHide?: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onHide,
  onSubmit,
  isSubmitting,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    isSubmittingOrder,
    customerRegistrationMutation,
    telegramUser,
    handleFormSubmit,
  } = useCheckoutForm();

  const clearCart = userStore((state) => state.clearCart);

  // Hide Checkout dialog when submit is clicked
  const handleLocalSubmit = async (data: any) => {
    await handleFormSubmit(data);
    if (onHide) onHide();
    // Clear items in cart shopping after submit
    clearCart();
    // Show success alert and hide dialog if order was submitted successfully
    if (
      customerRegistrationMutation.isSuccess ||
      (!isSubmittingOrder && !errors.phone_number && !errors.address)
    ) {
      toast.success("Order submitted successfully!");
      setShowDialog(false);
      setShowUserProfile(true); // Show UserProfile dialog
    }
    // Call parent onSubmit if provided
    if (onSubmit) onSubmit(data);
  };

  return (
    <div className="p-4">
      <Dialog
        header="Success"
        visible={showDialog}
        style={{ width: "350px" }}
        onHide={() => setShowDialog(false)}
        dismissableMask
      >
        <div className="text-center text-lg font-semibold">Hi all</div>
      </Dialog>
      {showUserProfile && (
        <UserProfile
          visible={showUserProfile}
          onHide={() => setShowUserProfile(false)}
        />
      )}
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Complete Your Order
      </h3>
      <form onSubmit={handleSubmit(handleLocalSubmit)} className="space-y-4">
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
          <label htmlFor="full_name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <InputText
            id="full_name"
            value={
              telegramUser?.first_name && telegramUser?.last_name
                ? `${telegramUser.first_name} ${telegramUser.last_name}`
                : telegramUser?.first_name || telegramUser?.last_name || ""
            }
            className="w-full"
            disabled={true}
            readOnly
          />
          {!(telegramUser?.first_name || telegramUser?.last_name) && (
            <small className="text-orange-500 mt-1 block">
              Unable to get your name from Telegram Mini App. Please check your
              Telegram profile.
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
            isSubmitting
              ? customerRegistrationMutation.isPending
                ? "Creating Profile..."
                : "Processing Order..."
              : "Submit Order"
          }
          icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
          className="w-full"
          disabled={false}
          loading={isSubmitting || customerRegistrationMutation.isPending}
        />
      </form>
    </div>
  );
};

export default CheckoutForm;
