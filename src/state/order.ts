import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { Order, CustomerInfo } from "../types/order";

interface OrderStoreType {
  orders: Order[];
  validCustomers: CustomerInfo[];

  // Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  cancelOrder: (orderId: string) => void;
  removeOrder: (orderId: string) => void;
  removeCancelledOrders: () => void;
  markOrderAsSubmitted: (orderId: string) => void;
  addValidCustomer: (customer: CustomerInfo) => void;
  isValidCustomer: (phone: string, name: string) => boolean;
  getValidCustomer: (phone: string) => CustomerInfo | null;
  clearOrders: () => void;
}

export const orderStore = create<OrderStoreType>()(
  devtools(
    persist(
      immer((set, get) => ({
        orders: [],
        validCustomers: [],

        addOrder: (order) => {
          set((state) => {
            state.orders.unshift(order); // Add to beginning of array (newest first)
          });
        },

        updateOrderStatus: (orderId, status) => {
          set((state) => {
            const order = state.orders.find((o) => o.orderId === orderId);
            if (order) {
              order.status = status;
            }
          });
        },

        cancelOrder: (orderId) => {
          set((state) => {
            const order = state.orders.find((o) => o.orderId === orderId);
            if (
              order &&
              (order.status === "pending" || order.status === "confirmed")
            ) {
              order.status = "cancelled";
            }
          });
        },

        removeOrder: (orderId) => {
          set((state) => {
            state.orders = state.orders.filter(
              (order) => order.orderId !== orderId
            );
          });
        },

        removeCancelledOrders: () => {
          set((state) => {
            state.orders = state.orders.filter(
              (order) => order.status !== "cancelled"
            );
          });
        },

        markOrderAsSubmitted: (orderId) => {
          set((state) => {
            const order = state.orders.find((o) => o.orderId === orderId);
            if (order) {
              order.submittedToApi = true;
              order.status = "confirmed";
            }
          });
        },

        addValidCustomer: (customer) => {
          set((state) => {
            // Check if customer already exists (by phone)
            const existingIndex = state.validCustomers.findIndex(
              (c) => c.phone === customer.phone
            );

            if (existingIndex !== -1) {
              // Update existing customer
              state.validCustomers[existingIndex] = customer;
            } else {
              // Add new customer
              state.validCustomers.push(customer);
            }
          });
        },

        isValidCustomer: (phone, name) => {
          const customers = get().validCustomers;
          return customers.some(
            (customer) =>
              customer.phone === phone &&
              customer.name.toLowerCase() === name.toLowerCase()
          );
        },

        getValidCustomer: (phone) => {
          const customers = get().validCustomers;
          return customers.find((customer) => customer.phone === phone) || null;
        },

        clearOrders: () => {
          set((state) => {
            state.orders = [];
          });
        },
      })),
      {
        name: "order-storage",
        partialize: (state) => ({
          orders: state.orders,
          validCustomers: state.validCustomers,
        }),
        version: 1,
      }
    )
  )
);
