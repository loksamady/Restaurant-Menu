import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import MyOrders from "./MyOrders";
import {
  getUserProfileSummary,
  getUserData,
  getUserInitials,
  isFirstOrder,
} from "@src/services/userService";

interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onHide }) => {
  const [showMyOrders, setShowMyOrders] = useState(false);

  // Get fresh data when component becomes visible
  const [profileSummary, setProfileSummary] = useState(getUserProfileSummary());
  const [userData, setUserData] = useState(getUserData());

  useEffect(() => {
    if (visible) {
      setProfileSummary(getUserProfileSummary());
      setUserData(getUserData());
    }
  }, [visible]);

  // Check if user has a real profile
  const hasRealProfile = (): boolean => {
    return !isFirstOrder();
  };

  // Get current user data
  const user = userData || getUserData();

  const getInitials = () => {
    if (!user) return "GU";
    return getUserInitials(user);
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
          {!hasRealProfile() ? (
            /* No Profile Yet State */
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to Our Restaurant!
                </h2>
                <p className="text-lg text-gray-600 mb-4">Hello Guest!</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Create Your Profile
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  Your profile will be automatically created when you place your
                  first order. All your order history, preferences, and
                  statistics will be saved.
                </p>
                <div className="space-y-2 text-sm text-blue-600">
                  <div className="flex items-center gap-2">
                    <i className="pi pi-check-circle text-green-600"></i>
                    <span>Order history tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-check-circle text-green-600"></i>
                    <span>Delivery preferences saved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-check-circle text-green-600"></i>
                    <span>Savings & rewards tracking</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  label="Browse Menu & Place Order"
                  icon="pi pi-shopping-cart"
                  onClick={onHide}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 px-8 py-3 text-lg"
                />
                <p className="text-sm text-gray-500">
                  Start shopping to create your profile automatically
                </p>
              </div>
            </div>
          ) : (
            /* Full Profile Display */
            <h1>hello</h1>
          )}
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
