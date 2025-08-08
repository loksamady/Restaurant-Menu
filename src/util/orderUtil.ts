import { CartMenuType } from "@src/types/cartMenu";
import { Order, OrderItem, CustomerInfo } from "@src/types/order";

// Deterministic orderId based on cart and customer info
export const generateOrderId = (
  cartMenus: CartMenuType[],
  customerInfo?: Partial<CustomerInfo>
): string => {
  // Use menuIds, quantities, and customer phone as a hash
  const cartString = cartMenus
    .map((cm) => `${cm.menu.menuId}:${cm.quantity}`)
    .join(",");
  const customerString = customerInfo?.phone || "";
  const raw = `${cartString}|${customerString}`;
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `order_${Math.abs(hash)}`;
};

export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");

  return `ORD-${year}${month}${day}-${random}`;
};

export const calculateOrderTotals = (
  items: Array<{ price: number; originalPrice?: number; quantity: number }>
) => {
  const originalAmount = items.reduce((total, item) => {
    return total + (item.originalPrice || item.price) * item.quantity;
  }, 0);

  const totalAmount = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const totalSavings = originalAmount - totalAmount;

  return {
    originalAmount,
    totalAmount,
    totalSavings,
  };
};

// Convert cart items to order items
export const convertCartToOrderItems = (
  cartMenus: CartMenuType[]
): OrderItem[] => {
  return cartMenus.map((cartMenu) => {
    const menu = cartMenu.menu;
    const originalPrice = menu.price || 0;
    const discountAmount = menu.discount || 0;
    const finalPrice = originalPrice - (originalPrice * discountAmount) / 100;

    // Get image information
    const hasFiles = Array.isArray(menu?.files) && menu?.files.length > 0;
    const fileName = hasFiles
      ? menu?.files.find((file) => file.main)?.fileName ??
        menu?.files[0].fileName
      : null;
    const filePath = hasFiles
      ? menu?.files.find((file) => file.main)?.filePath ??
        menu?.files[0].filePath
      : null;

    return {
      menuId: menu.menuId,
      name: menu.nameEn || menu.nameKh || "Unknown Item",
      nameEn: menu.nameEn,
      quantity: cartMenu.quantity,
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discountAmount,
      image: fileName || undefined,
      filePath: filePath || undefined,
    };
  });
};

// Calculate order totals from cart data
export const calculateOrderTotalsFromCart = (cartMenus: CartMenuType[]) => {
  const originalAmount = cartMenus.reduce((total, cartMenu) => {
    return total + (cartMenu.menu.price || 0) * cartMenu.quantity;
  }, 0);

  const totalAmount = cartMenus.reduce((total, cartMenu) => {
    const menu = cartMenu.menu;
    const originalPrice = menu.price || 0;
    const discountAmount = menu.discount || 0;
    const finalPrice = originalPrice - (originalPrice * discountAmount) / 100;
    return total + finalPrice * cartMenu.quantity;
  }, 0);

  const totalSavings = originalAmount - totalAmount;

  return {
    originalAmount,
    totalAmount,
    totalSavings,
  };
};

// Create a default customer info (can be customized later)
export const createDefaultCustomerInfo = (): CustomerInfo => {
  return {
    name: "Guest Customer",
    phone: "000-000-0000",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "cash",
  };
};

// Create complete order from cart data
export const createOrderFromCart = (
  cartMenus: CartMenuType[],
  customerInfo?: Partial<CustomerInfo>
): Order => {
  const orderId = generateOrderId(cartMenus, customerInfo);
  const orderNumber = generateOrderNumber();
  const orderItems = convertCartToOrderItems(cartMenus);
  const { originalAmount, totalAmount, totalSavings } =
    calculateOrderTotalsFromCart(cartMenus);

  // Merge with default customer info
  const finalCustomerInfo: CustomerInfo = {
    ...createDefaultCustomerInfo(),
    ...customerInfo,
  };

  const order: Order = {
    orderId,
    orderNumber,
    orderDate: new Date().toISOString(),
    status: "pending",
    items: orderItems,
    customerInfo: finalCustomerInfo,
    totalAmount,
    originalAmount,
    totalSavings,
    estimatedDeliveryTime: getEstimatedDeliveryTime(),
    submittedToApi: false,
  };

  return order;
};

// Calculate estimated delivery time (30-45 minutes from now)
const getEstimatedDeliveryTime = (): string => {
  const now = new Date();
  const deliveryTime = new Date(now.getTime() + 35 * 60 * 1000); // 35 minutes
  return deliveryTime.toISOString();
};
