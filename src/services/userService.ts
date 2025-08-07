import { toast } from "sonner";

// User data type for the service
export interface UserData {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string | null;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  createdAt: string;
  updatedAt?: string;
  // Checkout/Profile specific fields
  address?: string;
  telegramId?: string;
  telegramUsername?: string;
  preferredPaymentMethod?: string;
  orderCount?: number;
  totalSpent?: number;
  totalSaved?: number;
}

// Local storage key for user data
const USER_DATA_KEY = "restaurant_user_data";

// Get user data from localStorage
export const getUserData = (): UserData | null => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Save user data to localStorage
export const saveUserData = (userData: UserData): UserData => {
  try {
    const updatedUser = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Error saving user data:", error);
    toast.error("Failed to save user data");
    throw error;
  }
};

// Update user data
export const updateUserData = (updates: Partial<UserData>): UserData => {
  const currentUser = getUserData();
  if (!currentUser) {
    throw new Error("No user data found to update");
  }

  const updatedUser = {
    ...currentUser,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return saveUserData(updatedUser);
};

// Delete user data
export const deleteUserData = (): void => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
    toast.success("User data cleared");
  } catch (error) {
    console.error("Error deleting user data:", error);
    toast.error("Failed to clear user data");
  }
};

// Check if user data exists
export const hasUserData = (): boolean => {
  return getUserData() !== null;
};

// Create user data from form input
export const createUserFromForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username?: string;
}): UserData => {
  const userData: UserData = {
    id: Date.now(), // Simple ID generation
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    username:
      formData.username ||
      `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`,
    languageCode: "en",
    isPremium: false,
    createdAt: new Date().toISOString(),
  };

  return saveUserData(userData);
};

// Create user data from phone number (for browser users)
export const createUserFromPhone = (phoneNumber: string): UserData => {
  // Generate username from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, ""); // Remove non-digits
  const username = `user${cleanPhone.slice(-6)}`; // Use last 6 digits

  const userData: UserData = {
    id: Date.now(),
    firstName: "User",
    lastName: cleanPhone.slice(-4), // Use last 4 digits as last name
    email: "", // Empty email for phone-based users
    phone: phoneNumber,
    username: username,
    languageCode: "en",
    isPremium: false,
    createdAt: new Date().toISOString(),
  };

  return saveUserData(userData);
};

// Get user display name
export const getUserDisplayName = (user: UserData): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Get user initials
export const getUserInitials = (user: UserData): string => {
  return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
};

// Default fallback user data for demo purposes
export const getDefaultUserData = (): UserData => {
  return {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    avatar: null,
    username: "johndoe",
    languageCode: "en",
    isPremium: false,
    createdAt: "2024-01-01",
  };
};

// Create or update user data from checkout form
export const createOrUpdateUserFromCheckout = (
  checkoutData: {
    telegram_id: string;
    telegram_username: string;
    phone_number: string;
    address: string;
  },
  telegramUser?: {
    first_name?: string;
    last_name?: string;
    photo_url?: string;
    language_code?: string;
    is_premium?: boolean;
  }
): UserData => {
  const existingUser = getUserData();

  // If user exists, update with checkout data
  if (existingUser) {
    const updatedUser: UserData = {
      ...existingUser,
      phone: checkoutData.phone_number,
      address: checkoutData.address,
      telegramId: checkoutData.telegram_id,
      telegramUsername: checkoutData.telegram_username,
      // Update name if we have telegram data and current name is default
      firstName: telegramUser?.first_name || existingUser.firstName,
      lastName: telegramUser?.last_name || existingUser.lastName,
      username: checkoutData.telegram_username || existingUser.username,
      avatar: telegramUser?.photo_url || existingUser.avatar,
      updatedAt: new Date().toISOString(),
    };

    return saveUserData(updatedUser);
  }

  // Create new user from checkout data
  const newUser: UserData = {
    id: parseInt(checkoutData.telegram_id) || Date.now(),
    firstName:
      telegramUser?.first_name ||
      checkoutData.telegram_username.split("_")[0] ||
      "User",
    lastName: telegramUser?.last_name || "",
    email: `${checkoutData.telegram_username}@telegram.user`,
    phone: checkoutData.phone_number,
    address: checkoutData.address,
    telegramId: checkoutData.telegram_id,
    telegramUsername: checkoutData.telegram_username,
    username: checkoutData.telegram_username,
    avatar: telegramUser?.photo_url || null,
    languageCode: telegramUser?.language_code || "en",
    isPremium: telegramUser?.is_premium || false,
    preferredPaymentMethod: "cash",
    orderCount: 0,
    totalSpent: 0,
    totalSaved: 0,
    createdAt: new Date().toISOString(),
  };

  return saveUserData(newUser);
};

// Simple sync function for basic user data
export const updateUserFromTelegram = (telegramUser: {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}): UserData => {
  const existingUser = getUserData();

  const userData: UserData = {
    id: telegramUser.id || existingUser?.id || Date.now(),
    firstName: telegramUser.first_name || existingUser?.firstName || "User",
    lastName: telegramUser.last_name || existingUser?.lastName || "",
    email:
      existingUser?.email ||
      `${telegramUser.username || telegramUser.id}@telegram.user`,
    phone: existingUser?.phone || "",
    address: existingUser?.address || "",
    avatar: telegramUser.photo_url || existingUser?.avatar || null,
    username: telegramUser.username || existingUser?.username || "",
    telegramId: telegramUser.id?.toString() || existingUser?.telegramId || "",
    telegramUsername:
      telegramUser.username || existingUser?.telegramUsername || "",
    languageCode: existingUser?.languageCode || "en",
    isPremium: existingUser?.isPremium || false,
    preferredPaymentMethod: existingUser?.preferredPaymentMethod || "cash",
    orderCount: existingUser?.orderCount || 0,
    totalSpent: existingUser?.totalSpent || 0,
    totalSaved: existingUser?.totalSaved || 0,
    createdAt: existingUser?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveUserData(userData);
};

// Update user statistics after order completion
export const updateUserOrderStatistics = (
  orderAmount: number,
  savings: number
): UserData => {
  const currentUser = getUserData();
  if (!currentUser) {
    throw new Error("No user data found to update");
  }

  const updatedUser: UserData = {
    ...currentUser,
    orderCount: (currentUser.orderCount || 0) + 1,
    totalSpent: (currentUser.totalSpent || 0) + orderAmount,
    totalSaved: (currentUser.totalSaved || 0) + savings,
    updatedAt: new Date().toISOString(),
  };

  return saveUserData(updatedUser);
};

// Reset user order statistics (useful when clearing cart or resetting user data)
export const resetUserOrderStatistics = (): UserData => {
  const currentUser = getUserData();
  if (!currentUser) {
    throw new Error("No user data found to reset");
  }

  const updatedUser: UserData = {
    ...currentUser,
    orderCount: 0,
    totalSpent: 0,
    totalSaved: 0,
    updatedAt: new Date().toISOString(),
  };

  return saveUserData(updatedUser);
};

// Decrease order count (useful when canceling/deleting an order)
export const decreaseUserOrderCount = (
  orderAmount: number = 0,
  savings: number = 0
): UserData => {
  const currentUser = getUserData();
  if (!currentUser) {
    throw new Error("No user data found to update");
  }

  const updatedUser: UserData = {
    ...currentUser,
    orderCount: Math.max(0, (currentUser.orderCount || 0) - 1),
    totalSpent: Math.max(0, (currentUser.totalSpent || 0) - orderAmount),
    totalSaved: Math.max(0, (currentUser.totalSaved || 0) - savings),
    updatedAt: new Date().toISOString(),
  };

  return saveUserData(updatedUser);
};

// Check if this is user's first order
export const isFirstOrder = (): boolean => {
  const user = getUserData();
  return !user || user.orderCount === 0;
};

// Create user profile from first order
export const createUserProfileFromFirstOrder = (
  checkoutData: {
    phone: string;
    address: string;
    telegram_id?: string;
    telegram_username?: string;
  },
  orderAmount: number = 0,
  savings: number = 0
): UserData => {
  // Get current telegram user data if available
  const existingUser = getUserData();

  const newUser: UserData = {
    id:
      existingUser?.id ||
      parseInt(checkoutData.telegram_id || "") ||
      Date.now(),
    firstName: existingUser?.firstName || "User",
    lastName: existingUser?.lastName || "",
    email:
      existingUser?.email ||
      `${
        checkoutData.telegram_username || checkoutData.telegram_id
      }@telegram.user`,
    phone: checkoutData.phone,
    address: checkoutData.address,
    avatar: existingUser?.avatar || null,
    username: existingUser?.username || "",
    telegramId: checkoutData.telegram_id || existingUser?.telegramId || "",
    telegramUsername:
      checkoutData.telegram_username || existingUser?.telegramUsername || "",
    languageCode: existingUser?.languageCode || "en",
    isPremium: existingUser?.isPremium || false,
    preferredPaymentMethod: existingUser?.preferredPaymentMethod || "cash",
    orderCount: 1, // First order
    totalSpent: orderAmount,
    totalSaved: savings,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveUserData(newUser);
};

// Get user profile summary
export const getUserProfileSummary = (): {
  displayName: string;
  initials: string;
  memberSince: string;
  orderCount: number;
  totalSpent: number;
  totalSaved: number;
  isComplete: boolean;
} => {
  const user = getUserData();
  if (!user) {
    return {
      displayName: "Guest User",
      initials: "GU",
      memberSince: "Recently",
      orderCount: 0,
      totalSpent: 0,
      totalSaved: 0,
      isComplete: false,
    };
  }

  const isComplete = !!(user.phone && user.address && user.firstName);

  return {
    displayName: getUserDisplayName(user),
    initials: getUserInitials(user),
    memberSince: new Date(user.createdAt).getFullYear().toString(),
    orderCount: user.orderCount || 0,
    totalSpent: user.totalSpent || 0,
    totalSaved: user.totalSaved || 0,
    isComplete,
  };
};
