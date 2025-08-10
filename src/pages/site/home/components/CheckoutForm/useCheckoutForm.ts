import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import WebApp from "@twa-dev/sdk";
import { CreateCustomerSchema, CreateCustomerSchemaType } from "./validation";
import { getTelegramUser, getMockTelegramUser } from "./telegramUtil";
import { registerCustomer } from "./api";
import { createOrderFromCart } from "@src/util/orderUtil";
import { orderStore } from "@src/state/order";
import { userStore } from "@src/state/store";
import { useMutation } from "@tanstack/react-query";

export default function useCheckoutForm() {
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const cartMenus = userStore((state) => state.menus);
  const clearCart = userStore((state) => state.clearCart);
  const addOrder = orderStore((state) => state.addOrder);

  const customerRegistrationMutation = useMutation({
    mutationFn: registerCustomer,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<CreateCustomerSchemaType>({
    resolver: zodResolver(CreateCustomerSchema),
    mode: "onChange",
  });

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      const user = getTelegramUser(WebApp) || getMockTelegramUser();
      setTelegramUser(user);
      const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ");
      setValue("username", fullName || user.first_name || "");
      setValue("profile_picture", user.profile_picture || "");
      setValue("telegram_id", user.id?.toString() || "");
      setValue("telegram_username", user.username || "");
      setIsReady(true);
    } catch {
      const mockUser = getMockTelegramUser();
      setTelegramUser(mockUser);
      setValue("username", mockUser.username || mockUser.first_name || "");
      setValue("telegram_id", mockUser.id?.toString() || "");
      setValue("telegram_username", mockUser.username || "");
      setIsReady(true);
    }
  }, [setValue]);

  let submitTimeout: NodeJS.Timeout | null = null;
  const handleFormSubmit = async (data: CreateCustomerSchemaType) => {
    if (isSubmittingOrder) return; // Prevent double submit
    setIsSubmittingOrder(true);
    if (submitTimeout) clearTimeout(submitTimeout);
    submitTimeout = setTimeout(() => {}, 1000); // Debounce rapid clicks
    if (cartMenus.length === 0) {
      toast.error("Your cart is empty!");
      setIsSubmittingOrder(false);
      return;
    }
    const username = data.username?.trim() || "Guest";
    const phone = data.phone_number?.trim();
    if (!username || !phone || phone.length < 5) {
      toast.error("Invalid input");
      setIsSubmittingOrder(false);
      return;
    }
    // Check if there is already a customer profile in UserProfile
    const orders = orderStore.getState().orders;
    const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
    let customerInfo;
    if (
      latestOrder &&
      latestOrder.customerInfo &&
      latestOrder.customerInfo.phone
    ) {
      // If user changed phone or name, update profile for new order
      if (
        latestOrder.customerInfo.phone !== phone ||
        latestOrder.customerInfo.name !== username
      ) {
        customerInfo = {
          ...latestOrder.customerInfo,
          name: username,
          phone,
          address: data.address,
        };
      } else {
        customerInfo = latestOrder.customerInfo;
      }
    } else {
      // Prevent duplicate phone number only for active orders
      const activeStatuses = ["pending", "confirmed", "preparing", "ready"];
      const duplicateActivePhone = orders.some(
        (order) =>
          order.customerInfo.phone === phone &&
          activeStatuses.includes(order.status)
      );
      if (duplicateActivePhone) {
        toast.error(
          "This phone number already has an active order. Please wait until your previous order is completed or cancelled."
        );
        setIsSubmittingOrder(false);
        return;
      }
      let apiSuccess = false;
      try {
        const customerPayload = {
          ...data,
          telegram_id: telegramUser?.id?.toString() || data.telegram_id || "",
          telegram_username:
            telegramUser?.username || data.telegram_username || "",
          profile_picture:
            telegramUser?.photo_url || data.profile_picture || "",
        };
        console.log("Sending customer data to API backend:", customerPayload);
        await customerRegistrationMutation.mutateAsync(customerPayload);
        apiSuccess = true;
      } catch (e: any) {
        if (e?.response?.status === 409) apiSuccess = true;
      }
      if (!apiSuccess) {
        setIsSubmittingOrder(false);
        return;
      }
      customerInfo = {
        name: username,
        phone,
        address: data.address,
        profile_picture:
          telegramUser?.profile_picture || data.profile_picture || "",
        username: telegramUser?.username || data.username || "",
        languageCode: telegramUser?.language_code || "en",
        isPremium: false,
        create_at: new Date().toISOString(),
      };
    }

    // Only add order if not already present (by orderId)
    const order = createOrderFromCart(cartMenus, customerInfo);
    const existingOrder = orderStore
      .getState()
      .orders.find((o) => o.orderId === order.orderId);
    if (!existingOrder) {
      addOrder(order);
      clearCart();
      window.dispatchEvent(new Event("customer-updated"));
      toast.success("Order submitted!");
    } else {
      toast.error("Order already submitted!");
    }
    setIsSubmittingOrder(false);
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    handleFormSubmit,
    isSubmittingOrder,
    isReady,
    customerRegistrationMutation,
    telegramUser,
  };
}
