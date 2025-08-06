export const generateOrderId = (): string => {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
