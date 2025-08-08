import React from "react";
import { Button } from "primereact/button";
import { userStore } from "@src/state/store";
import CartIcon from "@src/pages/site/home/components/CartIcon";
import { toast } from "sonner";
import { MenuType } from "@src/types/website";

const TestCart: React.FC = () => {
  const addMenu = userStore((state) => state.addMenu);
  const cartMenus = userStore((state) => state.menus);
  const totalItems = cartMenus.reduce(
    (total, menu) => total + menu.quantity,
    0
  );

  // Sample menu items for testing
  const sampleMenus: MenuType[] = [
    {
      menuId: 1,
      nameEn: "Delicious Burger",
      nameKh: "ប៊ឺហ្គឺរឆ្ងាញ់",
      nameCn: "美味汉堡",
      code: "BURGER001",
      descriptionEn: "Juicy beef burger with fresh vegetables",
      descriptionKh: "ប៊ឺហ្គឺរសាច់គោឆ្ងាញ់ជាមួយបន្លែស្រស់",
      descriptionCn: "新鲜蔬菜牛肉汉堡",
      price: 12.99,
      priceKh: 52000,
      discount: 10,
      categories: [],
      hot: true,
      files: [],
      status: 1,
      merchantId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      menuId: 2,
      nameEn: "Pizza Supreme",
      nameKh: "ភីហ្សាអស្ចារ្យ",
      nameCn: "至尊披萨",
      code: "PIZZA001",
      descriptionEn: "Supreme pizza with all the toppings",
      descriptionKh: "ភីហ្សាអស្ចារ្យជាមួយគ្រឿងផ្សំទាំងអស់",
      descriptionCn: "配料丰富的至尊披萨",
      price: 18.5,
      priceKh: 74000,
      discount: 0,
      categories: [],
      hot: false,
      files: [],
      status: 1,
      merchantId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      menuId: 3,
      nameEn: "Fresh Salad",
      nameKh: "សាឡាត់ស្រស់",
      nameCn: "新鲜沙拉",
      code: "SALAD001",
      descriptionEn: "Fresh mixed greens with healthy vegetables",
      descriptionKh: "បន្លែស្រស់ចម្រុះជាមួយបន្លែមានសុខភាពល្អ",
      descriptionCn: "新鲜混合蔬菜沙拉",
      price: 8.99,
      priceKh: 36000,
      discount: 15,
      categories: [],
      hot: false,
      files: [],
      status: 1,
      merchantId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const addToCart = (menu: MenuType) => {
    addMenu(menu, 1);
    toast.success(`${menu.nameEn} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Test Cart & Checkout Flow
            </h1>
            <CartIcon
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
              itemCount={totalItems}
              showBadge={true}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              How to Test the Complete Flow:
            </h2>
            <ol className="text-blue-700 text-sm space-y-1">
              <li>
                1. Add some menu items to your cart using the buttons below
              </li>
              <li>2. Click the cart icon in the top-right to view your cart</li>
              <li>3. Click "Checkout" to open the checkout form</li>
              <li>4. Fill in your phone number and delivery address</li>
              <li>5. Submit the order to see it in your order history</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleMenus.map((menu) => (
              <div
                key={menu.menuId}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {menu.nameEn}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-green-600">
                    ${menu.price.toFixed(2)}
                  </span>
                  {menu.discount > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      {menu.discount}% OFF
                    </span>
                  )}
                  {menu.hot && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold">
                      🔥 HOT
                    </span>
                  )}
                </div>
                <Button
                  label="Add to Cart"
                  icon="pi pi-shopping-cart"
                  className="w-full"
                  onClick={() => addToCart(menu)}
                />
              </div>
            ))}
          </div>

          {cartMenus.length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Cart Summary ({totalItems} items)
              </h3>
              <ul className="text-green-700 text-sm space-y-1">
                {cartMenus.map((cartMenu) => (
                  <li key={cartMenu.menu.menuId}>
                    {cartMenu.menu.nameEn} x {cartMenu.quantity} = $
                    {(cartMenu.menu.price * cartMenu.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="text-green-800 font-semibold mt-2">
                Now click the cart icon to proceed to checkout! 🛒
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCart;
