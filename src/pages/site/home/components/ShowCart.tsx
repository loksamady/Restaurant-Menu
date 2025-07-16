import { useState } from "react";
const ShowCart = () => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Example: Add a dummy item to cart (replace with your real add-to-cart logic)
  const handleAddDummy = () => {
    setCartItems((prev) => [
      ...prev,
      {
        name: `Menu ${prev.length + 1}`,
        qty: 1,
        price: 5.5,
        image: "https://placehold.co/60x60",
      },
    ]);
  };
  // Remove item
  const handleRemoveItem = (idx: number) => {
    setCartItems((items) => items.filter((_, i) => i !== idx));
  };
  // Cart total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );
  return (
    <>
      <button
        className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors shadow-sm font-semibold mr-4"
        aria-label="View Cart"
        onClick={() => setShowCart(true)}
      >
        <i className="pi pi-shopping-cart text-lg" />
        <span className="font-semibold"></span>
        {/* Cart count badge */}
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-xs font-bold text-white shadow">
            {cartItems.length}
          </span>
        )}
      </button>
      {/* Cart Popup Dialog */}
      {showCart && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-0 relative flex flex-col md:flex-row overflow-hidden border border-gray-200">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-3xl z-10"
              onClick={() => setShowCart(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Left: Order Details & Cart Items + Billing Address */}
            <div className="w-full md:w-[60%] p-8 bg-white/80 backdrop-blur-md overflow-y-auto max-h-[90vh]">
              {/* Order Details Table */}
              <div className="font-bold text-lg mb-2">Order Details</div>
              <div className="flex items-center justify-between mb-4">
                {/* <div className="text-sm text-gray-500">
                        Invoice No:{" "}
                        <span className="font-mono text-gray-700">—</span>
                      </div> */}
                {/* <button
                        className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                        onClick={() => setCartItems([])}
                        disabled={cartItems.length === 0}
                      >
                        Clear All
                      </button> */}
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white/70">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-700">
                      <th className="p-2 font-semibold text-left">Product</th>
                      <th className="p-2 font-semibold text-center">Price</th>
                      <th className="p-2 font-semibold text-center">Qty</th>
                      <th className="p-2 font-semibold text-center">
                        Subtotal
                      </th>
                      <th className="p-2 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-gray-400 py-8"
                        >
                          Your cart is empty.
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="p-2 flex items-center gap-3 min-w-[180px]">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-lg object-cover border shadow-sm bg-gray-100"
                              />
                            )}
                            <div>
                              <div className="font-semibold text-base leading-tight">
                                {item.name}
                              </div>
                              {/* <div className="text-xs text-gray-500">
                                      SKU: <span className="font-mono">—</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Stock:{" "}
                                      <span className="font-mono">—</span>
                                    </div> */}
                            </div>
                          </td>
                          <td className="p-2 text-center font-semibold">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                                onClick={() => {
                                  setCartItems((cartItems) =>
                                    cartItems.map((ci, i) =>
                                      i === idx && ci.qty > 1
                                        ? { ...ci, qty: ci.qty - 1 }
                                        : ci
                                    )
                                  );
                                }}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="font-bold min-w-[32px] text-center">
                                {item.qty}
                              </span>
                              <button
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                                onClick={() => {
                                  setCartItems((cartItems) =>
                                    cartItems.map((ci, i) =>
                                      i === idx
                                        ? { ...ci, qty: ci.qty + 1 }
                                        : ci
                                    )
                                  );
                                }}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-2 text-center font-bold">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              className="text-red-500 hover:text-red-700 text-lg"
                              onClick={() => handleRemoveItem(idx)}
                              aria-label="Remove"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold border border-blue-200"
                  onClick={handleAddDummy}
                >
                  Add Custom Product
                </button>
              </div>
            </div>
            {/* Right: Payment Summary */}
            <div className="w-full md:w-[40%] p-12 bg-gray-50 border-l border-gray-200 flex flex-col justify-between">
              <div>
                <div className="font-bold text-lg mb-4">Payment Summary</div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Discount</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Tax (10%)</span>
                  <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-base font-bold border-t pt-2">
                  <span>Total Payable</span>
                  <span>${(cartTotal * 1.1).toFixed(2)}</span>
                </div>
                <button
                  className="flex-1 rounded bg-green-600 p-1 w-full hover:bg-green-700 text-white font-semibold border border-green-700"
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowCart;
