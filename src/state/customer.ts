import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CustomerType,
  OrderType,
  CartType,
  WishlistType,
  WishlistItemType,
} from "@src/types/customer";

// Customer State Interface
interface CustomerState {
  // Authentication State
  customer: CustomerType | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;

  // Loading States
  isLoading: boolean;
  isProfileLoading: boolean;
  isOrdersLoading: boolean;
  isCartLoading: boolean;
  isWishlistLoading: boolean;

  // Data State
  orders: OrderType[];
  cart: CartType | null;
  wishlist: WishlistType | null;
  loyaltyPoints: number;
  unreadNotifications: number;

  // Error State
  error: string | null;
}

// Customer Actions Interface
interface CustomerActions {
  // Authentication Actions
  setCustomer: (customer: CustomerType | null) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;

  // Loading Actions
  setLoading: (isLoading: boolean) => void;
  setProfileLoading: (isLoading: boolean) => void;
  setOrdersLoading: (isLoading: boolean) => void;
  setCartLoading: (isLoading: boolean) => void;
  setWishlistLoading: (isLoading: boolean) => void;

  // Data Actions
  setOrders: (orders: OrderType[]) => void;
  addOrder: (order: OrderType) => void;
  updateOrder: (orderId: number, updates: Partial<OrderType>) => void;
  removeOrder: (orderId: number) => void;

  setCart: (cart: CartType | null) => void;
  updateCartItemQuantity: (cartItemId: number, quantity: number) => void;
  removeCartItem: (cartItemId: number) => void;
  clearCart: () => void;

  setWishlist: (wishlist: WishlistType | null) => void;
  addToWishlist: (menuId: number) => void;
  removeFromWishlist: (wishlistItemId: number) => void;
  clearWishlist: () => void;

  setLoyaltyPoints: (points: number) => void;
  addLoyaltyPoints: (points: number) => void;
  deductLoyaltyPoints: (points: number) => void;

  setUnreadNotifications: (count: number) => void;
  incrementNotifications: () => void;
  decrementNotifications: () => void;
  clearNotifications: () => void;

  // Error Actions
  setError: (error: string | null) => void;
  clearError: () => void;

  // Utility Actions
  reset: () => void;
  updateProfile: (updates: Partial<CustomerType>) => void;
}

// Combined Customer Store Type
type CustomerStore = CustomerState & CustomerActions;

// Initial State
const initialState: CustomerState = {
  // Authentication State
  customer: null,
  isAuthenticated: false,
  token: null,
  refreshToken: null,

  // Loading States
  isLoading: false,
  isProfileLoading: false,
  isOrdersLoading: false,
  isCartLoading: false,
  isWishlistLoading: false,

  // Data State
  orders: [],
  cart: null,
  wishlist: null,
  loyaltyPoints: 0,
  unreadNotifications: 0,

  // Error State
  error: null,
};

// Customer Store
export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Authentication Actions
      setCustomer: (customer) => set({ customer }),

      setTokens: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: !!token,
        }),

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      logout: () =>
        set({
          customer: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          orders: [],
          cart: null,
          wishlist: null,
          loyaltyPoints: 0,
          unreadNotifications: 0,
          error: null,
        }),

      // Loading Actions
      setLoading: (isLoading) => set({ isLoading }),
      setProfileLoading: (isProfileLoading) => set({ isProfileLoading }),
      setOrdersLoading: (isOrdersLoading) => set({ isOrdersLoading }),
      setCartLoading: (isCartLoading) => set({ isCartLoading }),
      setWishlistLoading: (isWishlistLoading) => set({ isWishlistLoading }),

      // Data Actions - Orders
      setOrders: (orders) => set({ orders }),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      updateOrder: (orderId, updates) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderId === orderId ? { ...order, ...updates } : order
          ),
        })),

      removeOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.orderId !== orderId),
        })),

      // Data Actions - Cart
      setCart: (cart) => set({ cart }),

      updateCartItemQuantity: (cartItemId, quantity) =>
        set((state) => {
          if (!state.cart) return state;

          const updatedItems = state.cart.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
              : item
          );

          const subtotal = updatedItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );
          const discountAmount = updatedItems.reduce(
            (sum, item) => sum + item.discountAmount,
            0
          );

          return {
            cart: {
              ...state.cart,
              items: updatedItems,
              subtotal,
              totalAmount: subtotal - discountAmount,
            },
          };
        }),

      removeCartItem: (cartItemId) =>
        set((state) => {
          if (!state.cart) return state;

          const updatedItems = state.cart.items.filter(
            (item) => item.cartItemId !== cartItemId
          );
          const subtotal = updatedItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );
          const discountAmount = updatedItems.reduce(
            (sum, item) => sum + item.discountAmount,
            0
          );

          return {
            cart: {
              ...state.cart,
              items: updatedItems,
              subtotal,
              totalAmount: subtotal - discountAmount,
            },
          };
        }),

      clearCart: () =>
        set((state) => ({
          cart: state.cart
            ? {
                ...state.cart,
                items: [],
                subtotal: 0,
                discountAmount: 0,
                totalAmount: 0,
              }
            : null,
        })),

      // Data Actions - Wishlist
      setWishlist: (wishlist) => set({ wishlist }),

      addToWishlist: (menuId) =>
        set((state) => {
          if (!state.wishlist) return state;

          // Create a placeholder wishlist item
          // In real implementation, you'd fetch the menu details from API
          const newItem: WishlistItemType = {
            wishlistItemId: Date.now(), // Temporary ID
            wishlistId: state.wishlist.wishlistId,
            menu: {
              menuId,
              nameEn: "Loading...",
              nameKh: "",
              nameCn: "",
              code: `TEMP-${menuId}`,
              descriptionEn: "",
              descriptionKh: "",
              descriptionCn: "",
              price: 0,
              priceKh: 0,
              discount: 0,
              status: 1,
              categories: [],
              files: [],
              hot: false,
              merchantId: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            addedAt: new Date().toISOString(),
          };

          return {
            wishlist: {
              ...state.wishlist,
              items: [...state.wishlist.items, newItem],
            },
          };
        }),

      removeFromWishlist: (wishlistItemId) =>
        set((state) => {
          if (!state.wishlist) return state;

          return {
            wishlist: {
              ...state.wishlist,
              items: state.wishlist.items.filter(
                (item) => item.wishlistItemId !== wishlistItemId
              ),
            },
          };
        }),

      clearWishlist: () =>
        set((state) => ({
          wishlist: state.wishlist
            ? {
                ...state.wishlist,
                items: [],
              }
            : null,
        })),

      // Data Actions - Loyalty Points
      setLoyaltyPoints: (loyaltyPoints) => set({ loyaltyPoints }),

      addLoyaltyPoints: (points) =>
        set((state) => ({
          loyaltyPoints: state.loyaltyPoints + points,
        })),

      deductLoyaltyPoints: (points) =>
        set((state) => ({
          loyaltyPoints: Math.max(0, state.loyaltyPoints - points),
        })),

      // Data Actions - Notifications
      setUnreadNotifications: (unreadNotifications) =>
        set({ unreadNotifications }),

      incrementNotifications: () =>
        set((state) => ({
          unreadNotifications: state.unreadNotifications + 1,
        })),

      decrementNotifications: () =>
        set((state) => ({
          unreadNotifications: Math.max(0, state.unreadNotifications - 1),
        })),

      clearNotifications: () => set({ unreadNotifications: 0 }),

      // Error Actions
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Utility Actions
      reset: () => set(initialState),

      updateProfile: (updates) =>
        set((state) => ({
          customer: state.customer ? { ...state.customer, ...updates } : null,
        })),
    }),
    {
      name: "customer-store",
      partialize: (state) => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
        loyaltyPoints: state.loyaltyPoints,
      }),
    }
  )
);

// Selectors for easier access to computed values
export const useCustomerSelectors = () => {
  const store = useCustomerStore();

  return {
    // Authentication selectors
    isLoggedIn: store.isAuthenticated && !!store.customer,
    customerName: store.customer
      ? `${store.customer.firstName} ${store.customer.lastName}`
      : "",
    customerEmail: store.customer?.email || "",

    // Cart selectors
    cartItemsCount: store.cart?.items.length || 0,
    cartTotal: store.cart?.totalAmount || 0,
    cartSubtotal: store.cart?.subtotal || 0,
    cartDiscount: store.cart?.discountAmount || 0,
    isCartEmpty: !store.cart || store.cart.items.length === 0,

    // Wishlist selectors
    wishlistCount: store.wishlist?.items.length || 0,
    isWishlistEmpty: !store.wishlist || store.wishlist.items.length === 0,

    // Order selectors
    ordersCount: store.orders.length,
    recentOrders: store.orders.slice(0, 5),
    pendingOrders: store.orders.filter((order) => order.status === "pending"),

    // Status selectors
    hasUnreadNotifications: store.unreadNotifications > 0,
    isProfileComplete: !!(store.customer?.phone && store.customer?.address),

    // Loading selectors
    isAnyLoading:
      store.isLoading ||
      store.isProfileLoading ||
      store.isOrdersLoading ||
      store.isCartLoading ||
      store.isWishlistLoading,
  };
};
