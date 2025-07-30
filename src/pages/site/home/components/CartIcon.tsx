import { userStore } from "@src/state/store";
import { ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import ChangeQtyButtons from "./ChangeQtyButtons";
import { Button } from "primereact/button";
import { IMAGE_URL } from "@src/constant/env";
import OrderCard from "./OrderCard";
interface CartIconProps {
  className?: string;
  itemCount?: number;
  showBadge?: boolean;
  onClick?: () => void;
}
const CartIcon: React.FC<CartIconProps> = ({
  className = "",
  itemCount = 0,
  showBadge = false,
  onClick,
}: CartIconProps) => {
  const [visible, setVisible] = useState(false);
  const [orderVisible, setOrderVisible] = useState(false);
  const cartMenus = userStore((state) => state.menus);
  const resetCart = userStore((state) => state.clearCart);
  const removeMenu = userStore((state) => state.removeMenu);

  const handleResetCart = () => {
    resetCart();
    setVisible(false);
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
        <ShoppingBasket />
        {showBadge && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </div>
      <Dialog
        header="Shopping Cart"
        visible={visible}
        style={{ width: "90vw", maxWidth: "600px" }}
        // breakpoints={{ "960px": "100vw" }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-between items-center">
            <Button
              label="Reset Cart"
              icon="pi pi-trash"
              onClick={handleResetCart}
              className="p-button-danger p-button-outlined"
              disabled={cartMenus.length === 0}
            />
            <div className="flex gap-2">
              <Button
                label="Checkout"
                icon="pi pi-check"
                onClick={() => {
                  setVisible(false);
                  setOrderVisible(true);
                }}
                disabled={cartMenus.length === 0}
              />
            </div>
          </div>
        }
      >
        <div className="m-0">
          {cartMenus.length > 0 ? (
            <div>
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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">
                        Cart Items ({cartMenus.length})
                      </h3>
                      {hasAnySavings && (
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            💸 ${totalSavings.toFixed(2)} SAVED
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <div className="space-y-3 max-h-96 overflow-y-auto">
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
                        className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
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
                          <div className="flex flex-col">
                            <h4 className="font-medium text-sm">
                              {menu.nameEn}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Code: {menu.code}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {hasDiscount ? (
                                <>
                                  <span className="text-sm font-semibold text-green-600">
                                    ${finalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    ${originalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                                    -{discountAmount}% OFF
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm font-semibold">
                                  ${originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {hasDiscount && (
                              <div className="text-xs text-green-600 font-medium mt-0.5">
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
                        <div className="flex items-center space-x-2">
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
                <div className="mt-4 pt-3 border-t">
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
                        <div className="flex justify-between items-center mb-2 text-sm">
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
                            <div className="flex justify-between items-center mb-1 text-sm">
                              <span className="text-orange-600 flex items-center gap-1">
                                🏷️ Discount Applied:
                              </span>
                              <span className="text-orange-600 font-semibold">
                                -{savingsPercentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-3 text-sm">
                              <span className="text-green-600 font-medium flex items-center gap-1">
                                💰 You Save:
                              </span>
                              <span className="text-green-600 font-bold text-base">
                                -${totalSavings.toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}

                        {/* Final Total */}
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">
                              Final Total:
                            </span>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-green-600">
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
                            <div className="text-center text-sm text-green-700">
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
            <div className="text-center py-4">
              <ShoppingBasket
                size={48}
                className="mx-auto mb-3 text-gray-400"
              />
              <p className="text-gray-600">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-2">
                Add some products to get started!
              </p>
            </div>
          )}
        </div>
      </Dialog>

      <OrderCard visible={orderVisible} onHide={() => setOrderVisible(false)} />
    </>
  );
};

export default CartIcon;
