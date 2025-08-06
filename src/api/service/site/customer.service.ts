import {
  CUSTOMER_ENDPOINT,
  CART_ENDPOINT,
  ORDER_ENDPOINT,
} from "@src/constant/site/constant";
import {
  post,
  secureGet,
  securePost,
  securePut,
  secureRemove,
} from "../../config";
import {
  CreateCustomerType,
  UpdateCustomerType,
  CustomerLoginType,
  CustomerAuthResponseType,
  CreateOrderType,
  AddToCartType,
  UpdateCartItemType,
  CustomerResponseType,
  CustomersResponseType,
  OrderResponseType,
  OrdersResponseType,
  CartResponseType,
} from "@src/types/customer";
import { toastPromise } from "@src/util/toastUtil";
import { AdminMenuRequestParamType } from "@src/types/request";

/**
 * Customer Login
 */
export const loginCustomer = async (
  loginData: CustomerLoginType
): Promise<CustomerAuthResponseType> => {
  const data = post<CustomerLoginType>(`${CUSTOMER_ENDPOINT}/login`, loginData);

  if (data) toastPromise(data, "Login successful!", true);

  return await data;
};

// ===== CUSTOMER PROFILE SERVICES =====

/**
 * Get All Customers (Admin only)
 */
export const getCustomers = async (
  query?: AdminMenuRequestParamType
): Promise<CustomersResponseType> => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}`, query);
  return data;
};

/**
 * Get Customer by ID (Admin only)
 */
export const getCustomerById = async (
  customerId: number
): Promise<CustomerResponseType> => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/${customerId}`);
  return data;
};

/**
 * Create Customer (Admin only)
 */
export const createCustomer = async (customerData: CreateCustomerType) => {
  const data = securePost<CreateCustomerType>(
    `${CUSTOMER_ENDPOINT}`,
    customerData
  );

  if (data) toastPromise(data, "Customer created successfully!", true);

  return await data;
};

/**
 * Update Customer (Admin only)
 */
export const updateCustomer = async (
  customerId: number,
  updateData: UpdateCustomerType
) => {
  const data = securePut<UpdateCustomerType>(
    `${CUSTOMER_ENDPOINT}/${customerId}`,
    updateData
  );

  if (data) toastPromise(data, "Customer updated successfully!", true);

  return await data;
};

/**
 * Delete Customer (Admin only)
 */
export const deleteCustomer = async (customerId: number) => {
  const data = secureRemove(`${CUSTOMER_ENDPOINT}/${customerId}`);

  if (data) toastPromise(data, "Customer deleted successfully!", true);

  return await data;
};

// ===== CART SERVICES =====

/**
 * Get Customer Cart
 */
export const getCustomerCart = async (): Promise<CartResponseType> => {
  const data = await secureGet(`${CART_ENDPOINT}`);
  return data;
};

/**
 * Add Item to Cart
 */
export const addToCart = async (cartItem: AddToCartType) => {
  const data = securePost<AddToCartType>(`${CART_ENDPOINT}/add`, cartItem);

  if (data) toastPromise(data, "Item added to cart!", true);

  return await data;
};

/**
 * Update Cart Item Quantity
 */
export const updateCartItem = async (updateData: UpdateCartItemType) => {
  const data = securePut<UpdateCartItemType>(
    `${CART_ENDPOINT}/update`,
    updateData
  );

  if (data) toastPromise(data, "Cart updated!", true);

  return await data;
};

/**
 * Remove Item from Cart
 */
export const removeFromCart = async (cartItemId: number) => {
  const data = secureRemove(`${CART_ENDPOINT}/remove/${cartItemId}`);

  if (data) toastPromise(data, "Item removed from cart!", true);

  return await data;
};

/**
 * Clear Cart
 */
export const clearCart = async () => {
  const data = secureRemove(`${CART_ENDPOINT}/clear`);

  if (data) toastPromise(data, "Cart cleared!", true);

  return await data;
};
// ===== ORDER SERVICES =====

/**
 * Create Order from Cart
 */
export const createOrder = async (orderData: CreateOrderType) => {
  const data = securePost<CreateOrderType>(`${ORDER_ENDPOINT}`, orderData);

  if (data) toastPromise(data, "Order placed successfully!", true);

  return await data;
};

/**
 * Get Customer Orders
 */
export const getCustomerOrders = async (
  query?: AdminMenuRequestParamType
): Promise<OrdersResponseType> => {
  const data = await secureGet(`${ORDER_ENDPOINT}`, query);
  return data;
};

/**
 * Get Order by ID
 */
export const getOrderById = async (
  orderId: number
): Promise<OrderResponseType> => {
  const data = await secureGet(`${ORDER_ENDPOINT}/${orderId}`);
  return data;
};

/**
 * Cancel Order
 */
export const cancelOrder = async (orderId: number) => {
  const data = securePut(`${ORDER_ENDPOINT}/${orderId}/cancel`, {});

  if (data) toastPromise(data, "Order cancelled successfully!", true);

  return await data;
};

/**
 * Reorder (Add order items to cart)
 */
export const reorder = async (orderId: number) => {
  const data = securePost(`${ORDER_ENDPOINT}/${orderId}/reorder`, {});

  if (data) toastPromise(data, "Items added to cart for reorder!", true);

  return await data;
};
/**
 * Like/Unlike Review
 */
export const toggleReviewLike = async (reviewId: number) => {
  const data = securePost(
    `${CUSTOMER_ENDPOINT}/reviews/${reviewId}/toggle-like`,
    {}
  );

  return await data;
};

// ===== ADDRESS SERVICES =====

/**
 * Get Customer Addresses
 */
export const getCustomerAddresses = async () => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/addresses`);
  return data;
};

/**
 * Add Customer Address
 */
export const addCustomerAddress = async (addressData: {
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}) => {
  const data = securePost(`${CUSTOMER_ENDPOINT}/addresses`, addressData);

  if (data) toastPromise(data, "Address added successfully!", true);

  return await data;
};

/**
 * Update Customer Address
 */
export const updateCustomerAddress = async (
  addressId: number,
  addressData: {
    label?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
  }
) => {
  const data = securePut(
    `${CUSTOMER_ENDPOINT}/addresses/${addressId}`,
    addressData
  );

  if (data) toastPromise(data, "Address updated successfully!", true);

  return await data;
};

/**
 * Delete Customer Address
 */
export const deleteCustomerAddress = async (addressId: number) => {
  const data = secureRemove(`${CUSTOMER_ENDPOINT}/addresses/${addressId}`);

  if (data) toastPromise(data, "Address deleted successfully!", true);

  return await data;
};

// ===== LOYALTY & REWARDS SERVICES =====

/**
 * Get Customer Loyalty Points
 */
export const getCustomerLoyaltyPoints = async () => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/loyalty/points`);
  return data;
};

/**
 * Get Loyalty Transaction History
 */
export const getLoyaltyHistory = async (query?: AdminMenuRequestParamType) => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/loyalty/history`, query);
  return data;
};

/**
 * Redeem Loyalty Points
 */
export const redeemLoyaltyPoints = async (
  points: number,
  rewardId?: number
) => {
  const data = securePost(`${CUSTOMER_ENDPOINT}/loyalty/redeem`, {
    points,
    rewardId,
  });

  if (data) toastPromise(data, "Points redeemed successfully!", true);

  return await data;
};

// ===== NOTIFICATION SERVICES =====

/**
 * Get Customer Notifications
 */
export const getCustomerNotifications = async (
  query?: AdminMenuRequestParamType
) => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/notifications`, query);
  return data;
};

/**
 * Mark Notification as Read
 */
export const markNotificationAsRead = async (notificationId: number) => {
  const data = securePut(
    `${CUSTOMER_ENDPOINT}/notifications/${notificationId}/read`,
    {}
  );
  return await data;
};

/**
 * Mark All Notifications as Read
 */
export const markAllNotificationsAsRead = async () => {
  const data = securePut(`${CUSTOMER_ENDPOINT}/notifications/read-all`, {});

  if (data) toastPromise(data, "All notifications marked as read!", true);

  return await data;
};

/**
 * Delete Notification
 */
export const deleteNotification = async (notificationId: number) => {
  const data = secureRemove(
    `${CUSTOMER_ENDPOINT}/notifications/${notificationId}`
  );
  return await data;
};

// ===== ANALYTICS & REPORTING SERVICES =====

/**
 * Get Customer Order Statistics
 */
export const getCustomerOrderStats = async () => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/stats/orders`);
  return data;
};

/**
 * Get Customer Favorite Items
 */
export const getCustomerFavorites = async (limit: number = 10) => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/stats/favorites`, {
    limit,
  });
  return data;
};

/**
 * Get Customer Spending Summary
 */
export const getCustomerSpendingSummary = async (
  period: "month" | "quarter" | "year" = "month"
) => {
  const data = await secureGet(`${CUSTOMER_ENDPOINT}/stats/spending`, {
    period,
  });
  return data;
};
