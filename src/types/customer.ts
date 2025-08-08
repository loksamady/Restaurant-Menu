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
  username: string;
  telegramId?: number;
  telegramUsername?: string;
  phone?: string;
  address?: string[];
  state?: string;
  createdAt: string;
};

export type CustomerType = {
  id: number;
  username: string;
  telegramId?: number;
  telegramUsername?: string;
  phone?: string;
  address?: string[];
  state?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateCustomerType = {
  username?: string;
  telegramId?: number;
  telegramUsername?: string;
  phone?: string;
  address?: string;
  state?: string;
  updatedAt: string;
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

// Response Types
export type CustomerResponseType = BaseResponse<CustomerType>;
export type CustomersResponseType = BaseResponse<CustomerType[]>;
