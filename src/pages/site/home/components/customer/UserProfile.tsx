import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { orderStore } from "@src/state/order";
import { userStore } from "@src/state/store";
import { getCustomer } from "@src/api/service/site/customerRegistration.service";

interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onHide }) => {
  const orders = orderStore((state) => state.orders);
  const customer =
    orders.length > 0 ? orders[orders.length - 1].customerInfo : null;
  const menuItems = userStore((state) => state.menus);
  const [customerApi, setCustomerApi] = useState<{
    username?: string;
    phone_number?: string;
  } | null>(null);

  useEffect(() => {
    if (visible && customer?.id) {
      getCustomer(Number(customer.id)).then((data) => {
        setCustomerApi(data);
      });
    }
  }, [visible, customer]);

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="w-full sm:w-[400px] bg-white shadow-xl"
      dismissable={true}
      showCloseIcon={true}
      style={{ maxWidth: "100vw" }}
    >
      <div className="p-0 flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-6 flex items-center gap-4 rounded-b-2xl shadow">
          <Avatar
            label={customer?.name ? customer.name[0] : "U"}
            shape="circle"
            size="xlarge"
            className="bg-white text-blue-500 text-3xl font-bold border-4 border-blue-300 shadow"
          />
          <div>
            <div className="text-xl font-bold text-white">
              {customer?.name || "Guest"}
            </div>
            <div className="text-sm text-blue-100">
              @{customerApi?.username || "unknown"}
            </div>
            <div className="text-sm text-blue-100">
              @{customerApi?.phone_number || ""}
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Order Menu Items
            </h3>
            {menuItems && menuItems.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {menuItems.map((item: any, idx: number) => (
                  <li
                    key={idx}
                    className="py-3 flex justify-between items-center hover:bg-gray-50 rounded transition"
                  >
                    <span className="text-gray-800 font-medium">
                      {item.name}
                    </span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold text-sm">
                      x{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No menu items in order
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow transition"
            onClick={onHide}
          >
            Close
          </button>
        </div>
      </div>
    </Sidebar>
  );
};

export default UserProfile;
