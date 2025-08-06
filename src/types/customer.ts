import { BaseResponse } from "./response";
import { MenuType } from "./website";

export type UpdateProfileFormType = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
};

export type UpdateAddressType = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type CreateCustomerType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string[];
  dateOfBirth?: string;
};

export type CustomerType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string[];
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateCustomerType = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
};

// Order Types
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type OrderItemType = {
  orderItemId: number;
  menu: MenuType;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
};

export type OrderType = {
  orderId: number;
  orderNumber: string;
  customerId: number;
  customer?: CustomerType;
  items: OrderItemType[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  estimatedDeliveryTime: string | null;
  actualDeliveryTime: string | null;
  deliveryAddress: string | null;
  specialInstructions: string | null;
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderType = {
  items: {
    menuId: number;
    quantity: number;
  }[];
  deliveryAddress?: string;
  specialInstructions?: string;
  paymentMethod: "cash" | "card" | "online";
};

// Cart Types (extending existing)
export type CartType = {
  cartId: number;
  customerId: number;
  items: CartItemType[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type CartItemType = {
  cartItemId: number;
  cartId: number;
  menu: MenuType;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
};

export type AddToCartType = {
  menuId: number;
  quantity: number;
};

export type UpdateCartItemType = {
  cartItemId: number;
  quantity: number;
};

// Response Types
export type CustomerResponseType = BaseResponse<CustomerType>;
export type CustomersResponseType = BaseResponse<CustomerType[]>;
export type OrderResponseType = BaseResponse<OrderType>;
export type OrdersResponseType = BaseResponse<OrderType[]>;
export type CartResponseType = BaseResponse<CartType>;

// Authentication Types
export type CustomerLoginType = {
  email: string;
  password: string;
};

export type CustomerRegisterType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
};

export type CustomerAuthResponseType = BaseResponse<{
  customer: CustomerType;
  token: string;
  refreshToken: string;
}>;
