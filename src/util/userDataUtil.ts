// Utility to manage user data for the application

// Simple user data management without external dependencies
interface UserData {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  username: string;
  languageCode: string;
  isPremium: boolean;
  createdAt: string;
}

// Get default user data
const getDefaultUserData = (): UserData => ({
  id: "guest",
  firstName: "Guest",
  lastName: "",
  email: "",
  phone: "",
  avatar: null,
  username: "",
  languageCode: "en",
  isPremium: false,
  createdAt: new Date().toISOString().split("T")[0],
});

// Get user data from localStorage
const getUserData = (): UserData | null => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// Save user data to localStorage
const saveUserData = (userData: UserData): UserData => {
  localStorage.setItem("userData", JSON.stringify(userData));
  return userData;
};

// Initialize user data when the app loads
export const initializeUserData = () => {
  console.log("Initializing user data...");
  const currentUser = getUserData();
  console.log("Current user data:", currentUser);
  return currentUser;
};

// For browser users who provide phone number
export const setupUserFromPhone = (phoneNumber: string): UserData => {
  const userData: UserData = {
    ...getDefaultUserData(),
    id: Date.now(),
    phone: phoneNumber,
    firstName: "User",
  };
  return saveUserData(userData);
};

// For users who fill out a registration form
export const setupUserFromForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username?: string;
}): UserData => {
  const userData: UserData = {
    ...getDefaultUserData(),
    id: Date.now(),
    ...formData,
    username: formData.username || "",
  };
  return saveUserData(userData);
};

// For demo/testing - creates a sample user
export const setupSampleUser = (): UserData => {
  const sampleUser = getDefaultUserData();
  return saveUserData(sampleUser);
};

// Clear user data from localStorage
export const clearUserData = (): void => {
  localStorage.removeItem("userData");
  console.log("User data cleared from localStorage");
};

// Check if user has local data that can be deleted
export const hasUserData = (): boolean => {
  const userData = getUserData();
  return userData !== null && userData.id !== "guest";
};
