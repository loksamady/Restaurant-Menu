import React from "react";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import {
  Package,
  User,
  Star,
  Mail,
  Phone,
  Calendar,
  Edit3,
  ShoppingCart,
  Crown,
} from "lucide-react";
import MyOrders from "./MyOrders";
import { IMAGE_URL } from "@src/constant/env";
import { orderStore } from "@src/state/order";
import { useTelegramWebApp } from "@src/hooks/useTelegramWebApp";

interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
}

interface UserData {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  username: string;
  languageCode: string;
  isPremium: boolean;
  createdAt: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onHide }) => {
  const orders = orderStore((state) => state.orders);
  const { user: telegramUser } = useTelegramWebApp();

  // Simple user data logic - use Telegram user or default guest
  const user: UserData = telegramUser
    ? {
        id: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || "",
        email: "",
        phone: "",
        avatar: telegramUser.photo_url || null,
        username: telegramUser.username || "",
        languageCode: telegramUser.language_code || "en",
        isPremium: telegramUser.is_premium || false,
        createdAt: new Date().toISOString().split("T")[0],
      }
    : {
        id: "guest",
        firstName: "Guest",
        lastName: "",
        email: "",
        phone: "",
        avatar: null,
        username: "",
        languageCode: "en",
        isPremium: false,
        createdAt: new Date().toISOString().split("T")[0],
      };

  const hasProfile = orders.length > 0; // Has profile if user has placed orders
  const initials = user.firstName.charAt(0) + (user.lastName.charAt(0) || "");
  const displayName =
    `${user.firstName} ${user.lastName}`.trim() || "Guest User";
  const imageUrl = user.avatar?.startsWith("http")
    ? user.avatar
    : user.avatar
    ? `${IMAGE_URL}/${user.avatar}`
    : undefined;

  // Feature items
  const features = [
    { icon: Package, color: "green", text: "Order history tracking" },
    { icon: Star, color: "blue", text: "Personalized recommendations" },
    { icon: Crown, color: "purple", text: "Exclusive rewards & offers" },
  ];

  const WelcomeScreen = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-6">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white">
            <User className="w-16 h-16 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Crown className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Our Merchants!
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            Hello {user.firstName}! 👋
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          label="Browse Menu & Place Order"
          icon={<ShoppingCart className="w-5 h-5 mr-2" />}
          onClick={onHide}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        />
        <p className="text-sm text-gray-500">
          Start shopping to create your profile automatically ✨
        </p>
      </div>
    </div>
  );

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
            {user.email && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            )}
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
              Member since {new Date(user.createdAt).getFullYear()}
            </span>
          </div>
        </div>

        {/* <Button
          icon={<Edit3 className="w-4 h-4" />}
          label="Edit Profile"
          className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm transition-all duration-300 rounded-xl px-6 py-3"
          size="small"
          onClick={() => console.log("Edit profile clicked")}
        /> */}
      </div>
    </div>
  );

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
        {!hasProfile ? (
          <WelcomeScreen />
        ) : (
          <div className="space-y-8">
            <ProfileHeader />
            <OrdersSection />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default UserProfile;
