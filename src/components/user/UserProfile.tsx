import React from "react";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import {
  Package,
  User,
  Phone,
  Calendar,
  ShoppingCart,
  Crown,
} from "lucide-react";
import MyOrders from "./MyOrders";
import { IMAGE_URL } from "@src/constant/env";
import { orderStore } from "@src/state/order";
import { getCustomer } from "@src/api/service/site/customerRegistration.service";
import { useEffect, useState } from "react";

interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
}

// User data type for profile display
interface UserData {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string | null;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  create_at?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onHide }) => {
  // Loading and error state for profile
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orders = orderStore((state) => state.orders);
  // State for customer data
  const [user, setUser] = useState<UserData>({
    id: "guest",
    firstName: "Guest",
    lastName: "",
    phone: "",
    avatar: null,
    username: "",
    languageCode: "en",
    isPremium: false,
    create_at: new Date().toISOString().split("T")[0],
  });

  // Fetch and set customer data from local store or API
  // Always use latest order's customerInfo for UserProfile
  const fetchCustomer = () => {
    setLoading(true);
    setError(null);
    if (orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      const localCustomer = latestOrder.customerInfo;
      if (localCustomer && localCustomer.id && localCustomer.name) {
        setUser({
          id: localCustomer.id,
          firstName:
            localCustomer.name?.split(" ")[0] ||
            localCustomer.name ||
            "Customer",
          lastName: localCustomer.name?.split(" ")[1] || "",
          phone: localCustomer.phone || "",
          avatar: localCustomer.profile_picture || null,
          username: localCustomer.username || "",
          languageCode: localCustomer.languageCode || "en",
          isPremium: localCustomer.isPremium || false,
          create_at:
            localCustomer.create_at || new Date().toISOString().split("T")[0],
        });
        setLoading(false);
        return;
      }
      // If no full info, fallback to API
      if (localCustomer && localCustomer.id) {
        getCustomer(String(localCustomer.id))
          .then((customer) => {
            if (customer) {
              setUser({
                id: customer.id,
                firstName:
                  customer.name?.split(" ")[0] || customer.name || "Customer",
                lastName: customer.name?.split(" ")[1] || "",
                phone: customer.phone || "",
                avatar: customer.profile_picture || null,
                username: customer.username || "",
                languageCode: customer.languageCode || "en",
                isPremium: customer.isPremium || false,
                create_at:
                  customer.create_at || new Date().toISOString().split("T")[0],
              });
            } else {
              setError("No customer data found for this ID.");
            }
          })
          .catch(() => {
            setError("Failed to fetch customer data from API.");
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      }
    }
    setError("No customer ID available. Please submit an order first.");
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomer();
    // Listen for customer-updated event to refresh profile
    const handler = () => fetchCustomer();
    window.addEventListener("customer-updated", handler);
    return () => window.removeEventListener("customer-updated", handler);
  }, [orders]);

  // Profile display helpers
  const initials = `${user.firstName?.charAt(0) ?? "G"}${
    user.lastName?.charAt(0) ?? ""
  }`;
  const displayName =
    `${user.firstName ?? "Guest"} ${user.lastName ?? ""}`.trim() ||
    "Guest User";
  const imageUrl =
    user.avatar &&
    typeof user.avatar === "string" &&
    user.avatar.startsWith("http")
      ? user.avatar
      : user.avatar
      ? `${IMAGE_URL}/${user.avatar}`
      : undefined;

  // Profile header component
  const ProfileHeader = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>

      <div className="relative flex flex-col lg:flex-row items-center gap-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          <Avatar
            label={imageUrl ? undefined : initials}
            image={imageUrl}
            size="xlarge"
            shape="circle"
            className="relative w-28 h-28 text-3xl font-bold bg-white/20 text-white border-4 border-white/30 shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
            }}
          />
          {user.isPremium && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Crown className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center lg:text-left space-y-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">
              {displayName}
              {user.username && (
                <span className="text-xl font-normal text-white/60 ml-3">
                  @{user.username}
                </span>
              )}
            </h2>
            {user.isPremium && (
              <Badge
                value="Premium Member"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-white/90">
            {/* Email field removed */}
            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{user.phone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-white/80 justify-center lg:justify-start">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">
              Member since {new Date(user.create_at ?? "").getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Orders section component
  const OrdersSection = () => (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="p-8">
        {orders.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-700">
                No orders yet
              </h4>
              <p className="text-gray-500 max-w-md mx-auto">
                When you place your first order, it will appear here with all
                the details and tracking information.
              </p>
            </div>

            <Button
              label="Start Shopping"
              icon={<ShoppingCart className="w-5 h-5 mr-2" />}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={onHide}
            />
          </div>
        ) : (
          <MyOrders />
        )}
      </div>
    </div>
  );

  // Main profile dialog
  return (
    <Dialog
      header={
        <div className="flex items-center gap-4 p-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Profile
            </span>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account and preferences
            </p>
          </div>
        </div>
      }
      visible={visible}
      style={{ width: "95vw", maxWidth: "1200px", height: "95vh" }}
      onHide={onHide}
      dismissableMask
      draggable={false}
      resizable={false}
      className="user-profile-dialog"
    >
      <div className="space-y-8 p-4 max-h-[calc(95vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <i className="pi pi-spinner pi-spin text-2xl mb-4"></i>
            <p className="text-gray-600">Loading customer data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <h4 className="text-2xl font-bold text-gray-700 mb-2">Error</h4>
            <p className="text-red-500 max-w-md mx-auto mb-6">{error}</p>
            <Button
              label="Retry"
              icon={<ShoppingCart className="w-5 h-5 mr-2" />}
              onClick={fetchCustomer}
              className="bg-gradient-to-r from-red-500 to-pink-600 border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            />
          </div>
        ) : (
          <>
            <ProfileHeader />
            <div className="space-y-8">
              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-700 mb-2">
                      No orders yet
                    </h4>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      You haven't placed any orders yet. Browse the menu and add
                      items to start your order!
                    </p>
                    <Button
                      label="Browse Menu & Place Order"
                      icon={<ShoppingCart className="w-5 h-5 mr-2" />}
                      onClick={onHide}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    />
                  </div>
                </div>
              ) : (
                <OrdersSection />
              )}
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default UserProfile;
