import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { userStore } from "@src/state/store";
import { orderStore } from "@src/state/order";
import { IMAGE_URL } from "@src/constant/env";
import { createOrder } from "@src/api/service/site/customer.service";
import { toast } from "sonner";
import { CreateOrderType } from "@src/types/customer";
import { Order, CustomerInfo, OrderItem } from "@src/types/order";
import {
  generateOrderId,
  generateOrderNumber,
  calculateOrderTotals,
} from "@src/util/orderUtil";

interface OrderFormProps {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmitSuccess, onCancel }) => {
  const cartMenus = userStore((state) => state.menus);
  const clearCart = userStore((state) => state.clearCart);

  // Order store actions
  const addOrder = orderStore((state) => state.addOrder);
  const addValidCustomer = orderStore((state) => state.addValidCustomer);
  const isValidCustomer = orderStore((state) => state.isValidCustomer);
  const getValidCustomer = orderStore((state) => state.getValidCustomer);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "cash",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerValidationStatus, setCustomerValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    type: "success" | "info" | "warn" | "error";
  } | null>(null);

  // Check customer validation when phone or name changes
  useEffect(() => {
    if (customerInfo.phone && customerInfo.name) {
      const isValid = isValidCustomer(customerInfo.phone, customerInfo.name);

      if (isValid) {
        setCustomerValidationStatus({
          isValid: true,
          message:
            "Valid customer found! Order will be submitted directly to API.",
          type: "success",
        });

        // Autofill customer info if found
        const existingCustomer = getValidCustomer(customerInfo.phone);
        if (
          existingCustomer &&
          existingCustomer.name.toLowerCase() ===
            customerInfo.name.toLowerCase()
        ) {
          setCustomerInfo((prev) => ({
            ...prev,
            email: existingCustomer.email || prev.email,
            address: existingCustomer.address || prev.address,
            paymentMethod: existingCustomer.paymentMethod || prev.paymentMethod,
          }));
        }
      } else {
        setCustomerValidationStatus({
          isValid: false,
          message:
            "New customer detected. Order will be saved to My Orders for review.",
          type: "info",
        });
      }
    } else {
      setCustomerValidationStatus(null);
    }
  }, [
    customerInfo.phone,
    customerInfo.name,
    isValidCustomer,
    getValidCustomer,
  ]);

  const paymentMethods = [
    { label: "Cash on Delivery", value: "cash" },
    { label: "Credit Card", value: "card" },
    { label: "Online Payment", value: "online" },
  ];

  const calculateTotal = () => {
    return cartMenus.reduce((total, cartMenu) => {
      const menu = cartMenu.menu;
      const originalPrice = menu.price || 0;
      const discountAmount = menu.discount || 0;
      const finalPrice = originalPrice - (originalPrice * discountAmount) / 100;
      return total + finalPrice * cartMenu.quantity;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Please fill in required fields (Name and Phone)");
      return;
    }

    if (cartMenus.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert cart items to order items
      const orderItems: OrderItem[] = cartMenus.map((cartMenu) => {
        const menu = cartMenu.menu;
        const hasFiles = Array.isArray(menu?.files) && menu?.files.length > 0;
        const fileName = hasFiles
          ? menu?.files.find((file) => file.main)?.fileName ??
            menu?.files[0].fileName
          : null;
        const filePath = hasFiles
          ? menu?.files.find((file) => file.main)?.filePath ??
            menu?.files[0].filePath
          : null;

        const originalPrice = menu.price || 0;
        const discountAmount = menu.discount || 0;
        const finalPrice =
          originalPrice - (originalPrice * discountAmount) / 100;

        return {
          menuId: menu.menuId,
          name: menu.nameEn || `Menu ${menu.menuId}`,
          nameEn: menu.nameEn,
          quantity: cartMenu.quantity,
          price: finalPrice,
          originalPrice: originalPrice,
          discount: discountAmount,
          image: fileName || undefined,
          filePath: filePath || undefined,
        };
      });

      // Calculate totals
      const { originalAmount, totalAmount, totalSavings } =
        calculateOrderTotals(orderItems);

      // Create order object
      const orderId = generateOrderId();
      const orderNumber = generateOrderNumber();

      const newOrder: Order = {
        orderId,
        orderNumber,
        orderDate: new Date().toISOString(),
        status: "pending",
        items: orderItems,
        customerInfo: { ...customerInfo },
        totalAmount,
        originalAmount,
        totalSavings,
        deliveryAddress: customerInfo.address || undefined,
        specialInstructions: customerInfo.notes || undefined,
        submittedToApi: false,
      };

      // Check if customer is valid
      const isValid = isValidCustomer(customerInfo.phone, customerInfo.name);

      if (isValid) {
        // Valid customer - submit directly to API
        try {
          const orderData: CreateOrderType = {
            items: orderItems.map((item) => ({
              menuId: item.menuId,
              quantity: item.quantity,
            })),
            deliveryAddress: customerInfo.address || undefined,
            specialInstructions: customerInfo.notes || undefined,
            paymentMethod: customerInfo.paymentMethod,
          };

          await createOrder(orderData);

          // Mark order as submitted and add to store
          newOrder.submittedToApi = true;
          newOrder.status = "confirmed";
          addOrder(newOrder);

          toast.success(
            "Order submitted successfully! We'll contact you soon."
          );
          console.log("Order submitted to API:", orderData);
        } catch (apiError) {
          // If API fails, still save to local store but mark as not submitted
          newOrder.submittedToApi = false;
          newOrder.status = "pending";
          addOrder(newOrder);

          console.error("API submission failed:", apiError);
          toast.error(
            "Order saved locally but failed to submit to API. Please check your connection."
          );
        }
      } else {
        // New customer - save to My Orders only
        addOrder(newOrder);
        addValidCustomer(customerInfo); // Add to valid customers for future orders

        toast.success(
          "Order saved to My Orders! Please review and submit manually."
        );
        console.log("Order saved locally:", newOrder);
      }

      // Clear cart and reset form
      clearCart();
      setCustomerInfo({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
        paymentMethod: "cash",
      });

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalOriginal = cartMenus.reduce((total, cartMenu) => {
    return total + (cartMenu.menu.price || 0) * cartMenu.quantity;
  }, 0);

  const totalDiscounted = calculateTotal();
  const totalSavings = totalOriginal - totalDiscounted;
  const hasAnySavings = totalSavings > 0;

  return (
    <div className="order-form">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary Section */}
        <div className="order-summary">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📋 Order Summary
            {hasAnySavings && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                ${totalSavings.toFixed(2)} Saved
              </span>
            )}
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {cartMenus.map((cartMenu) => {
              const menu = cartMenu.menu;
              const hasFiles =
                Array.isArray(menu?.files) && menu?.files.length > 0;
              const fileName = hasFiles
                ? menu?.files.find((file) => file.main)?.fileName ??
                  menu?.files[0].fileName
                : null;
              const filePath = hasFiles
                ? menu?.files.find((file) => file.main)?.filePath ??
                  menu?.files[0].filePath
                : null;

              const originalPrice = menu.price || 0;
              const discountAmount = menu.discount || 0;
              const finalPrice =
                originalPrice - (originalPrice * discountAmount) / 100;
              const hasDiscount = discountAmount > 0;

              return (
                <div
                  key={menu.menuId}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                >
                  <img
                    src={
                      filePath
                        ? filePath
                        : fileName
                        ? `${IMAGE_URL}/${fileName}`
                        : "/placeholder-food.jpg"
                    }
                    alt={menu.nameEn || "Menu item"}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{menu.nameEn}</h4>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">
                        Qty: {cartMenu.quantity}
                      </span>
                      {hasDiscount ? (
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 font-semibold">
                            ${finalPrice.toFixed(2)}
                          </span>
                          <span className="text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${(finalPrice * cartMenu.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Total */}
          <div className="border-t pt-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartMenus.length} items):</span>
                <span
                  className={
                    hasAnySavings
                      ? "line-through text-gray-400"
                      : "font-semibold"
                  }
                >
                  ${totalOriginal.toFixed(2)}
                </span>
              </div>
              {hasAnySavings && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>You Save:</span>
                  <span className="font-semibold">
                    -${totalSavings.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">
                  ${totalDiscounted.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="customer-info">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            👤 Customer Information
          </h3>

          {/* Customer Validation Status */}
          {customerValidationStatus && (
            <div className="mb-4">
              <Message
                severity={customerValidationStatus.type}
                text={customerValidationStatus.message}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <InputText
                id="name"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number *
              </label>
              <InputText
                id="phone"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <InputText
                id="email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
              >
                Delivery Address
              </label>
              <InputTextarea
                id="address"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
                placeholder="Enter your delivery address"
                rows={3}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="payment"
                className="block text-sm font-medium mb-1"
              >
                Payment Method
              </label>
              <Dropdown
                id="payment"
                value={customerInfo.paymentMethod}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, paymentMethod: e.value })
                }
                options={paymentMethods}
                placeholder="Select payment method"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Special Notes
              </label>
              <InputTextarea
                id="notes"
                value={customerInfo.notes}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, notes: e.target.value })
                }
                placeholder="Any special instructions for your order..."
                rows={2}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            {onCancel && (
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={onCancel}
                className="p-button-text"
                disabled={isSubmitting}
              />
            )}
            <Button
              label={isSubmitting ? "Submitting..." : "Submit Order"}
              icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
              onClick={handleSubmitOrder}
              className="p-button-success ml-auto"
              disabled={
                !customerInfo.name || !customerInfo.phone || isSubmitting
              }
              loading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
