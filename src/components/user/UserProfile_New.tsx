import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import {
  Package,
  User,
  Phone,
  MapPin,
  Trophy,
  DollarSign,
  Calendar,
  Crown,
} from "lucide-react";
import MyOrders from "./MyOrders";
import { IMAGE_URL } from "@src/constant/env";
import { useTelegramWebApp } from "@src/hooks/useTelegramWebApp";
import {
  getUserProfileSummary,
  getUserData,
  getUserInitials,
  UserData,
} from "@src/services/userService";

interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onHide }) => {
  const [showMyOrders, setShowMyOrders] = useState(false);
  const { user: telegramUser } = useTelegramWebApp();

  // Get enhanced user profile summary
  const profileSummary = getUserProfileSummary();
  const userData = getUserData();

  // Get user data with fallback to Telegram and default data
  const getUserFromService = (): UserData => {
    if (userData) {
      return userData;
    }

    if (telegramUser) {
      return {
        id: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || "",
        email: `${telegramUser.username || telegramUser.id}@telegram.user`,
        phone: "",
        address: "",
        avatar: telegramUser.photo_url || null,
        username: telegramUser.username || "",
        languageCode: telegramUser.language_code || "en",
        isPremium: telegramUser.is_premium || false,
        telegramId: telegramUser.id.toString(),
        telegramUsername: telegramUser.username || "",
        preferredPaymentMethod: "cash",
        orderCount: 0,
        totalSpent: 0,
        totalSaved: 0,
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id: Date.now(),
      firstName: "Guest",
      lastName: "User",
      email: "guest@restaurant.com",
      phone: "",
      address: "",
      avatar: null,
      username: "guest",
      languageCode: "en",
      isPremium: false,
      preferredPaymentMethod: "cash",
      orderCount: 0,
      totalSpent: 0,
      totalSaved: 0,
      createdAt: new Date().toISOString(),
    };
  };

  const user = getUserFromService();

  const getInitials = () => {
    return getUserInitials(user);
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
    <>
      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
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
                    const target = e.target as HTMLImageElement;
                    target.src = "";
                  }}
                />
                {user.isPremium && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-3 h-3 text-yellow-800" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">
                  {profileSummary.displayName}
                </h2>
                <p className="text-white/80 mb-2">
                  @{user.username || user.telegramUsername || "user"}
                </p>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {profileSummary.memberSince}</span>
                  </div>
                  {profileSummary.isComplete && (
                    <Badge
                      value="Complete Profile"
                      className="bg-green-500/20 text-green-100 border-green-300/30"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {profileSummary.orderCount}
                  </p>
                  <p className="text-sm text-green-600">Total Orders</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">
                    ${profileSummary.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-600">Total Spent</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-4 p-2">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">
                    ${profileSummary.totalSaved.toFixed(2)}
                  </p>
                  <p className="text-sm text-purple-600">Money Saved</p>
                </div>
              </div>
            </Card>
          </div>

          {/* User Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-800">
                      {`${user.firstName} ${user.lastName}`.trim() ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-800">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Language
                    </label>
                    <p className="text-gray-800">
                      {user.languageCode?.toUpperCase() || "EN"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact & Delivery Information */}
            <Card className="border-0 shadow-lg">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Contact & Delivery
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-800">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Delivery Address
                    </label>
                    <p className="text-gray-800">
                      {user.address || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Preferred Payment
                    </label>
                    <p className="text-gray-800 capitalize">
                      {user.preferredPaymentMethod || "Cash"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              label="View My Orders"
              icon="pi pi-shopping-bag"
              onClick={() => setShowMyOrders(true)}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 px-6 py-2"
            />
            <Button
              label="Edit Profile"
              icon="pi pi-user-edit"
              onClick={handleEditProfile}
              className="p-button-outlined border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2"
              disabled
            />
          </div>
        </div>
      </Dialog>

      {/* MyOrders Dialog */}
      {showMyOrders && (
        <MyOrders
          visible={showMyOrders}
          onHide={() => setShowMyOrders(false)}
        />
      )}
    </>
  );
};

export default UserProfile;
