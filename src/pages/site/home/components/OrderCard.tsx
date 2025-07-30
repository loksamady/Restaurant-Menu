import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { userStore } from "@src/state/store";
import { IMAGE_URL } from "@src/constant/env";

interface OrderCardProps {
  visible: boolean;
  onHide: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ visible, onHide }) => {
  const cartMenus = userStore((state) => state.menus);
  const clearCart = userStore((state) => state.clearCart);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "cash",
  });

  const paymentMethods = [
    { label: "Cash on Delivery", value: "cash" },
    { label: "Credit Card", value: "credit" },
    { label: "Bank Transfer", value: "bank" },
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

  const handleSubmitOrder = () => {
    // Here you would typically send the order to your backend
    // console.log("Order submitted:", {
    //   customer: customerInfo,
    //   items: cartMenus,
    //   total: calculateTotal(),
    // });
    // // Clear cart and close dialogs
    // clearCart();
    // onHide();
    // // Show success message
    // alert("Order submitted successfully! We'll contact you soon.");
    console.log("first-name: " + customerInfo.name);
    
    console.log("Order submitted:", {
      customer: customerInfo,
      items: cartMenus,
      total: calculateTotal(),
    });

  };

  const totalOriginal = cartMenus.reduce((total, cartMenu) => {
    return total + (cartMenu.menu.price || 0) * cartMenu.quantity;
  }, 0);

  const totalDiscounted = calculateTotal();
  const totalSavings = totalOriginal - totalDiscounted;
  const hasAnySavings = totalSavings > 0;

  return (
    <Dialog
      header="Complete Your Order"
      visible={visible}
      style={{ width: "90vw", maxWidth: "800px" }}
      onHide={onHide}
      footer={
        <div className="flex justify-between items-center">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button
            label="Submit Order"
            icon="pi pi-check"
            onClick={handleSubmitOrder}
            className="p-button-success"
            disabled={!customerInfo.name || !customerInfo.phone}
          />
        </div>
      }
    >
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
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OrderCard;
