import { userStore } from "@src/state/store";
import { ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import ChangeQtyButtons from "./ChangeQtyButtons";
import { Button } from "primereact/button";
import { IMAGE_URL } from "@src/constant/env";
import { orderStore } from "@src/state/order";
import { createOrderFromCart } from "@src/util/orderUtil";
import { toast } from "sonner";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import { CreateCustomerSchemaType } from "./CheckoutForm/validation";
interface CartIconProps {
  className?: string;
  itemCount?: number;
  showBadge?: boolean;
  onClick?: () => void;
  onCheckout?: () => void;
}
const CartIcon: React.FC<CartIconProps> = ({
  className = "",
  itemCount = 0,
  showBadge = false,
  onClick,
  onCheckout,
}: CartIconProps) => {
  const [visible, setVisible] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const cartMenus = userStore((state) => state.menus);
  const resetCart = userStore((state) => state.clearCart);
  const removeMenu = userStore((state) => state.removeMenu);
  const addOrder = orderStore((state) => state.addOrder);

  const handleResetCart = () => {
    resetCart();
    setVisible(false);
    toast.success("Cart cleared!");
  };

  const handleCheckout = () => {
    if (cartMenus.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setVisible(false); // Hide cart dialog
    setShowCheckoutForm(true); // Show checkout form
  };

  const handleCheckoutSubmit = async (
    checkoutData: CreateCustomerSchemaType
  ) => {
    setIsSubmittingOrder(true);

    try {
      // Simple order creation without complex user management
      const newOrder = createOrderFromCart(cartMenus, {
        name:
          checkoutData.telegram_username || checkoutData.username || "Customer",
        phone: checkoutData.phone_number,
        address: checkoutData.address,
        email: `${
          checkoutData.telegram_username || checkoutData.username
        }@telegram.user`,
        notes: `Telegram ID: ${checkoutData.telegram_id}, Username: @${
          checkoutData.telegram_username || checkoutData.username
        }`,
        paymentMethod: "cash" as const,
      });
      // If customer profile exists, go directly to MyOrders
      const orders = orderStore.getState().orders;
      const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
      const hasCustomerProfile =
        latestOrder &&
        latestOrder.customerInfo &&
        latestOrder.customerInfo.phone;
      if (hasCustomerProfile) {
        setShowMyOrders(true);
        setVisible(false);
        return;
      }
      // Otherwise, show checkout form
      setShowCheckoutForm(true);
      addOrder(newOrder);

      // Clear the cart
      resetCart();

      // Close dialogs
      setVisible(false);
      setShowCheckoutForm(false);

      // Show success message
      const totalItems = cartMenus.reduce(
        (total, menu) => total + menu.quantity,
        0
      );

      toast.success(
        `Order ${newOrder.orderNumber} created successfully! 
        ${totalItems} items • $${newOrder.totalAmount.toFixed(2)}`
      );

      // Show MyOrders after successful checkout
      // setShowMyOrders(true);

      // Call the onCheckout callback
      if (onCheckout) {
        onCheckout();
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const calculateTotal = () => {
    return cartMenus.reduce((total, cartMenu) => {
      const menu = cartMenu.menu;
      const originalPrice = menu.price || 0;
      const discountAmount = menu.discount || 0;
      const finalPrice = originalPrice - (originalPrice * discountAmount) / 100;
      return total + finalPrice * cartMenu.quantity;
    }, 0);
  };
  return (
    <>
      <div
        className={`relative flex items-center justify-center cursor-pointer ${className}`}
        onClick={() => {
          setVisible(true);
          if (onClick) onClick();
        }}
      >
        <ShoppingBasket className="w-5 h-5 sm:w-6 sm:h-6" />
        {showBadge && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center min-w-[16px] sm:min-w-[20px]">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </div>
      {/* Dialog for Shopping Cart */}
      <Dialog
        header="Shopping Cart"
        visible={visible}
        style={{
          width: "95vw",
          maxWidth: "600px",
          minWidth: "320px",
        }}
        onHide={() => setVisible(false)}
        className="cart-dialog"
        contentStyle={{
          padding: "0",
          maxHeight: "70vh",
          overflow: "hidden",
        }}
        headerStyle={{
          padding: "1rem",
          fontSize: "1.1rem",
        }}
        footer={
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-2">
            <Button
              label="Reset Cart"
              icon="pi pi-trash"
              onClick={handleResetCart}
              className="p-button-danger p-button-outlined w-full sm:w-auto text-xs sm:text-sm"
              disabled={cartMenus.length === 0}
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                label="Checkout"
                icon="pi pi-check"
                onClick={handleCheckout}
                disabled={cartMenus.length === 0}
                className="w-full sm:w-auto text-xs sm:text-sm"
              />
            </div>
          </div>
        }
      >
        <div className="m-0 p-2 sm:p-4 max-h-full overflow-hidden flex flex-col">
          {cartMenus.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="mb-4">
                {(() => {
                  const totalOriginal = cartMenus.reduce((total, cartMenu) => {
                    return (
                      total + (cartMenu.menu.price || 0) * cartMenu.quantity
                    );
                  }, 0);
                  const totalDiscounted = calculateTotal();
                  const totalSavings = totalOriginal - totalDiscounted;
                  const hasAnySavings = totalSavings > 0;

                  return (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                      <h3 className="text-base sm:text-lg font-semibold">
                        Cart Items ({cartMenus.length})
                      </h3>
                      {hasAnySavings && (
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            💸 ${totalSavings.toFixed(2)} SAVED
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <div
                  className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto overscroll-contain"
                  style={{ scrollbarWidth: "thin" }}
                >
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
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border rounded-lg bg-gray-50 gap-3"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <img
                            src={
                              filePath
                                ? filePath
                                : fileName
                                ? `${IMAGE_URL}/${fileName}`
                                : "/placeholder-food.jpg"
                            }
                            alt={menu.nameEn || "Menu item"}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex flex-col min-w-0 flex-1">
                            <h4 className="font-medium text-xs sm:text-sm truncate">
                              {menu.nameEn}
                            </h4>
                            <p className="text-xs text-gray-500 hidden sm:block">
                              Code: {menu.code}
                            </p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                              {hasDiscount ? (
                                <>
                                  <span className="text-xs sm:text-sm font-semibold text-green-600">
                                    ${finalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    ${originalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-medium">
                                    -{discountAmount}% OFF
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs sm:text-sm font-semibold">
                                  ${originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {hasDiscount && (
                              <div className="text-xs text-green-600 font-medium mt-0.5 hidden sm:block">
                                Save $
                                {(
                                  (originalPrice - finalPrice) *
                                  cartMenu.quantity
                                ).toFixed(2)}{" "}
                                on {cartMenu.quantity} item
                                {cartMenu.quantity > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <ChangeQtyButtons menuId={menu.menuId} />
                          <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-text p-button-danger p-button-sm"
                            onClick={() => removeMenu(menu.menuId.toString())}
                            title="Remove from cart"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 sm:mt-4 pt-3 border-t flex-shrink-0">
                  {(() => {
                    const totalOriginal = cartMenus.reduce(
                      (total, cartMenu) => {
                        return (
                          total + (cartMenu.menu.price || 0) * cartMenu.quantity
                        );
                      },
                      0
                    );
                    const totalDiscounted = calculateTotal();
                    const totalSavings = totalOriginal - totalDiscounted;
                    const hasAnySavings = totalSavings > 0;
                    const savingsPercentage =
                      totalOriginal > 0
                        ? (totalSavings / totalOriginal) * 100
                        : 0;

                    return (
                      <>
                        {/* Subtotal (Original Prices) */}
                        <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Subtotal ({cartMenus.length} items):
                          </span>
                          <span
                            className={
                              hasAnySavings
                                ? "text-gray-400 line-through"
                                : "text-gray-800 font-semibold"
                            }
                          >
                            ${totalOriginal.toFixed(2)}
                          </span>
                        </div>

                        {/* Discount Information */}
                        {hasAnySavings && (
                          <>
                            <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                              <span className="text-orange-600 flex items-center gap-1">
                                🏷️ Discount Applied:
                              </span>
                              <span className="text-orange-600 font-semibold">
                                -{savingsPercentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-3 text-xs sm:text-sm">
                              <span className="text-green-600 font-medium flex items-center gap-1">
                                💰 You Save:
                              </span>
                              <span className="text-green-600 font-bold text-sm sm:text-base">
                                -${totalSavings.toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}

                        {/* Final Total */}
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-base sm:text-lg font-bold text-gray-800">
                              Final Total:
                            </span>
                            <div className="text-right">
                              <span className="text-lg sm:text-2xl font-bold text-green-600">
                                ${totalDiscounted.toFixed(2)}
                              </span>
                              {hasAnySavings && (
                                <div className="text-xs text-green-600 font-medium">
                                  (${totalSavings.toFixed(2)} saved)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Additional Savings Message */}
                        {hasAnySavings && (
                          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-center text-xs sm:text-sm text-green-700">
                              🎉 <strong>Congratulations!</strong> You're saving{" "}
                              <span className="font-bold">
                                ${totalSavings.toFixed(2)}
                              </span>{" "}
                              on this order!
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <ShoppingBasket
                size={40}
                className="mx-auto mb-3 text-gray-400 sm:w-12 sm:h-12"
              />
              <p className="text-gray-600 text-sm sm:text-base">
                Your cart is empty
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Add some products to get started!
              </p>
            </div>
          )}
        </div>
      </Dialog>

      {/* Checkout Form Dialog */}
      <Dialog
        header="Checkout"
        visible={showCheckoutForm}
        style={{
          width: "95vw",
          maxWidth: "500px",
          minWidth: "320px",
        }}
        onHide={() => setShowCheckoutForm(false)}
        closable={!isSubmittingOrder}
        className="checkout-dialog"
        contentStyle={{
          padding: "1rem",
          maxHeight: "70vh",
          overflow: "auto",
        }}
        headerStyle={{
          padding: "1rem",
          fontSize: "1.1rem",
        }}
      >
        <CheckoutForm />
      </Dialog>
    </>
  );
};

export default CartIcon;
