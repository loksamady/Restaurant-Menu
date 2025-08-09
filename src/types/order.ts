export interface OrderItem {
  menuId: number;
  name: string;
  nameEn?: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discount?: number;
  image?: string;
  filePath?: string;
}

export interface CustomerInfo {
  id?: number | string;
  name: string;
  phone: string;
  profile_picture?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  create_at?: string;
  email?: string;
  address?: string;
  notes?: string;
  paymentMethod: "cash" | "card" | "online";
}

export interface Order {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  originalAmount: number;
  totalSavings: number;
  deliveryAddress?: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  submittedToApi: boolean; // Track if order was submitted to API
}

export interface OrderSummary {
  orderId: string;
  items: Array<{
    menuId: number;
    quantity: number;
  }>;
  totalAmount: number;
  deliveryAddress?: string;
  specialInstructions?: string;
  paymentMethod: string;
}
