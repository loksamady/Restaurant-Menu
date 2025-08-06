import React from "react";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Package } from "lucide-react";
import MyOrders from "./MyOrders";
import { IMAGE_URL } from "@src/constant/env";
import { orderStore } from "@src/state/order";
import { useTelegramWebApp } from "@src/hooks/useTelegramWebApp";
import {
  getUserData,
  getDefaultUserData,
  getUserDisplayName,
  getUserInitials,
  UserData,
} from "@src/services/userService";

interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onHide }) => {
  const orders = orderStore((state) => state.orders);
  const { user: telegramUser } = useTelegramWebApp();

  // Get user data from user service, fallback to Telegram data, then default data
  const getUserFromService = (): UserData => {
    // First try to get user data from service
    const serviceUser = getUserData();
    if (serviceUser) {
      return serviceUser;
    }

    // If no service data, create from Telegram user if available
    if (telegramUser) {
      return {
        id: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || "",
        email: "", // Telegram doesn't provide email by default
        phone: "", // Telegram doesn't provide phone by default
        avatar: telegramUser.photo_url || null,
        username: telegramUser.username || "",
        languageCode: telegramUser.language_code || "en",
        isPremium: telegramUser.is_premium || false,
        createdAt: new Date().toISOString().split("T")[0], // Current date as fallback
      };
    }

    // Fallback to default user data
    return getDefaultUserData();
  };

  const user = getUserFromService();

  const getInitials = () => {
    return getUserInitials(user);
  };

  const getDisplayName = () => {
    return getUserDisplayName(user);
  };

  const getImageUrl = () => {
    // If user has an avatar and it's from local storage, use IMAGE_URL
    if (user.avatar && !user.avatar.startsWith("http")) {
      return `${IMAGE_URL}/${user.avatar}`;
    }
    // If user has an avatar that's already a full URL (from Telegram), use it directly
    if (user.avatar && user.avatar.startsWith("http")) {
      return user.avatar;
    }
    // If we have telegramUser with photo_url, use it directly
    if (telegramUser?.photo_url) {
      return telegramUser.photo_url;
    }
    // No image available
    return undefined;
  };

  const handleEditProfile = () => {
    // TODO: Open edit profile dialog/form
    // You can implement a separate EditProfileDialog component here
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <i className="pi pi-user text-white text-sm"></i>
          </div>
          <span className="text-xl font-semibold text-gray-800">
            My Profile
          </span>
        </div>
      }
      visible={visible}
      style={{ width: "95vw", maxWidth: "1000px", height: "95vh" }}
      onHide={onHide}
      dismissableMask
      draggable={false}
      resizable={false}
      className="user-profile-dialog"
    >
      <div className="user-profile-container space-y-6">
        {/* Enhanced User Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          </div>

          <div className="relative flex items-center gap-6">
            <div className="relative">
              <Avatar
                label={getImageUrl() ? undefined : getInitials()}
                image={getImageUrl()}
                size="xlarge"
                shape="circle"
                className="w-20 h-20 text-2xl font-bold bg-white/20 text-white border-4 border-white/30 shadow-lg"
                onError={(e) => {
                  // Hide the image and show initials instead
                  const target = e.target as HTMLImageElement;
                  target.src = "";
                }}
              />
              {user.isPremium && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <i className="pi pi-star-fill text-yellow-800 text-xs"></i>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h2 className="text-3xl font-bold">
                {getDisplayName()}
                {user.username && (
                  <span className="text-lg font-normal text-white/80 ml-2">
                    @{user.username}
                  </span>
                )}
              </h2>

              <div className="flex flex-wrap gap-4 text-white/90">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <i className="pi pi-envelope text-sm"></i>
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <i className="pi pi-phone text-sm"></i>
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-white/80">
                <i className="pi pi-calendar text-sm"></i>
                <span className="text-sm">
                  Member since {new Date(user.createdAt).getFullYear()}
                </span>
              </div>
            </div>

            <Button
              icon="pi pi-pencil"
              label="Edit Profile"
              className="p-button-outlined border-white/30 text-white hover:bg-white/10 transition-all duration-200"
              size="small"
              onClick={handleEditProfile}
            />
          </div>
        </div>

        {/* Enhanced My Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">My Orders</h3>
                  <p className="text-sm text-gray-500">
                    Track and manage your orders
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge
                    value={orders.length}
                    severity="info"
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                  />
                  <span className="text-sm text-gray-500">
                    {orders.length === 1 ? "order" : "orders"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Orders Content */}
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  No orders yet
                </h4>
                <p className="text-gray-500 mb-6">
                  When you place your first order, it will appear here.
                </p>
                <Button
                  label="Start Shopping"
                  icon="pi pi-shopping-cart"
                  className="p-button-rounded bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                  onClick={onHide}
                />
              </div>
            ) : (
              <MyOrders />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .user-profile-dialog .p-dialog-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 1.5rem 2rem;
        }
        
        .user-profile-dialog .p-dialog-content {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        
        .user-profile-container {
          max-height: calc(95vh - 180px);
          overflow-y: auto;
        }
        
        .user-profile-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .user-profile-container::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        
        .user-profile-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        
        .user-profile-container::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Enhanced animations */
        .user-profile-dialog {
          animation: slideInUp 0.3s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Hover effects */
        .user-profile-container .bg-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        
        /* Badge styling */
        .p-badge {
          font-weight: 600;
          letter-spacing: 0.025em;
        }
        
        /* Button hover effects */
        .p-button:hover {
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
      `}</style>
    </Dialog>
  );
};

export default UserProfile;
