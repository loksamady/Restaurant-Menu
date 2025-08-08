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

export default function useCheckoutForm(
  onSubmit: Function,
  isLoading: boolean = false
) {
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
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
    defaultValues: {
      username: "",
      phone_number: "",
      address: "",
      telegram_id: "",
      telegram_username: "",
    },
  });

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      const user = getTelegramUser(WebApp) || getMockTelegramUser();
      setTelegramUser(user);
      setValue("username", user.username);
      setValue("telegram_id", user.id?.toString() || "");
      setValue("telegram_username", user.username || "");
      setIsReady(true);
    } catch {
      const mockUser = getMockTelegramUser();
      setTelegramUser(mockUser);
      setValue("username", mockUser.username);
      setValue("telegram_id", mockUser.id.toString());
      setValue("telegram_username", mockUser.username);
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
    let apiSuccess = false;
    try {
      await customerRegistrationMutation.mutateAsync({
        ...data,
        telegramId: telegramUser?.id,
        telegramUsername: telegramUser?.username,
        profilePicture: telegramUser?.photo_url,
      });
      apiSuccess = true;
    } catch (e: any) {
      if (e?.response?.status === 409) apiSuccess = true;
    }
    if (apiSuccess) {
      // Only add order if not already present (by orderId)
      const order = createOrderFromCart(cartMenus, {
        name: username,
        phone,
        address: data.address,
      });
      // Check if order already exists in store
      const existingOrder = orderStore
        .getState()
        .orders.find((o) => o.orderId === order.orderId);
      if (!existingOrder) {
        addOrder(order);
        clearCart();
        onSubmit({
          ...data,
          telegram_id: telegramUser?.id?.toString(),
          telegram_username: telegramUser?.username,
          profile_picture: telegramUser?.photo_url,
        });
        toast.success("Order submitted!");
      } else {
        toast.error("Order already submitted!");
      }
    }
    setIsSubmittingOrder(false);
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmittingOrder,
    isReady,
    telegramUser,
    handleFormSubmit,
    customerRegistrationMutation,
  };
}
