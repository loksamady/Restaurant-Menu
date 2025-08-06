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
    toast.success("User data saved successfully");
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

// Initialize sample user data for testing (call this once)
export const initializeSampleUser = (): UserData => {
  // Check if user data already exists
  if (hasUserData()) {
    return getUserData()!;
  }

  // Create sample user data
  const sampleUser: UserData = {
    id: 1001,
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@restaurant.com",
    phone: "+1-555-0123",
    avatar: null,
    username: "alexj",
    languageCode: "en",
    isPremium: true,
    createdAt: "2024-03-15",
  };

  return saveUserData(sampleUser);
};
