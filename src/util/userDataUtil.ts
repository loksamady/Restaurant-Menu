// Utility to manage user data for the application
import {
  initializeSampleUser,
  getUserData,
  createUserFromPhone,
  createUserFromForm,
} from "../services/userService";

// Initialize user data when the app loads
export const initializeUserData = () => {
  // You can call this when your app starts to set up sample data
  // or when a user first visits your app

  console.log("Initializing user data...");

  // Example: Initialize with sample user for demo
  // Uncomment the line below to create sample user data
  // initializeSampleUser();

  const currentUser = getUserData();
  console.log("Current user data:", currentUser);

  return currentUser;
};

// Example usage functions you can call from your components:

// For browser users who provide phone number
export const setupUserFromPhone = (phoneNumber: string) => {
  return createUserFromPhone(phoneNumber);
};

// For users who fill out a registration form
export const setupUserFromForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username?: string;
}) => {
  return createUserFromForm(formData);
};

// For demo/testing - creates a sample user
export const setupSampleUser = () => {
  return initializeSampleUser();
};
