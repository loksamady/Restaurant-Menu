import { z } from "zod";

// Customer Registration Schema
export const CustomerRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Customer Login Schema
export const CustomerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Update Customer Profile Schema
export const CreateCustomerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(50, "City must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(50, "State must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  zipCode: z
    .string()
    .max(20, "Zip code must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .max(50, "Country must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
});

// Change Password Schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Reset Password Schema
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Add to Cart Schema
export const AddToCartSchema = z.object({
  menuId: z.number().positive("Menu ID must be a positive number"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(99, "Quantity cannot exceed 99"),
});

// Update Cart Item Schema
export const UpdateCartItemSchema = z.object({
  cartItemId: z.number().positive("Cart item ID must be a positive number"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(99, "Quantity cannot exceed 99"),
});

// Create Order Schema
export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        menuId: z.number().positive("Menu ID must be a positive number"),
        quantity: z
          .number()
          .min(1, "Quantity must be at least 1")
          .max(99, "Quantity cannot exceed 99"),
      })
    )
    .min(1, "Order must contain at least one item"),
  deliveryAddress: z
    .string()
    .max(300, "Delivery address must be less than 300 characters")
    .optional(),
  specialInstructions: z
    .string()
    .max(500, "Special instructions must be less than 500 characters")
    .optional(),
  paymentMethod: z.enum(["cash", "card", "online"], {
    errorMap: () => ({
      message: "Payment method must be cash, card, or online",
    }),
  }),
});

// Create Review Schema
export const CreateReviewSchema = z.object({
  menuId: z.number().positive("Menu ID must be a positive number"),
  orderId: z.number().positive("Order ID must be a positive number").optional(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .max(1000, "Comment must be less than 1000 characters")
    .optional(),
});

// Customer Address Schema
export const CustomerAddressSchema = z.object({
  label: z
    .string()
    .min(2, "Address label must be at least 2 characters")
    .max(50, "Address label must be less than 50 characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters"),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must be less than 50 characters"),
  zipCode: z
    .string()
    .min(3, "Zip code must be at least 3 characters")
    .max(20, "Zip code must be less than 20 characters"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be less than 50 characters"),
  isDefault: z.boolean().optional(),
});

// Update Customer Address Schema
export const UpdateCustomerAddressSchema = z.object({
  label: z
    .string()
    .min(2, "Address label must be at least 2 characters")
    .max(50, "Address label must be less than 50 characters")
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters")
    .optional(),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must be less than 50 characters")
    .optional(),
  zipCode: z
    .string()
    .min(3, "Zip code must be at least 3 characters")
    .max(20, "Zip code must be less than 20 characters")
    .optional(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be less than 50 characters")
    .optional(),
  isDefault: z.boolean().optional(),
});

// Redeem Points Schema
export const RedeemPointsSchema = z.object({
  points: z
    .number()
    .min(1, "Points must be at least 1")
    .max(100000, "Points cannot exceed 100,000"),
  rewardId: z
    .number()
    .positive("Reward ID must be a positive number")
    .optional(),
});

// Apply Coupon Schema
export const ApplyCouponSchema = z.object({
  couponCode: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be less than 20 characters"),
});

// Track Order Schema
export const TrackOrderSchema = z.object({
  orderNumber: z
    .string()
    .min(5, "Order number must be at least 5 characters")
    .max(20, "Order number must be less than 20 characters"),
});

// Email Verification Schema
export const EmailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Export schema types
export type CustomerRegisterSchemaType = z.infer<typeof CustomerRegisterSchema>;
export type CustomerLoginSchemaType = z.infer<typeof CustomerLoginSchema>;
export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;
export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export type AddToCartSchemaType = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemSchemaType = z.infer<typeof UpdateCartItemSchema>;
export type CreateOrderSchemaType = z.infer<typeof CreateOrderSchema>;
export type CreateReviewSchemaType = z.infer<typeof CreateReviewSchema>;
export type CustomerAddressSchemaType = z.infer<typeof CustomerAddressSchema>;
export type UpdateCustomerAddressSchemaType = z.infer<
  typeof UpdateCustomerAddressSchema
>;
export type RedeemPointsSchemaType = z.infer<typeof RedeemPointsSchema>;
export type ApplyCouponSchemaType = z.infer<typeof ApplyCouponSchema>;
export type TrackOrderSchemaType = z.infer<typeof TrackOrderSchema>;
export type EmailVerificationSchemaType = z.infer<
  typeof EmailVerificationSchema
>;
