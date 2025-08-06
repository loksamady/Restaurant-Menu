import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Settings, Package, MapPin, CreditCard } from "lucide-react";
import MyOrders from "./MyOrders";
import ShippingAddress from "./ShippingAddress";
import PaymentMethods from "./PaymentMethods";
import ProfileSettings from "./ProfileSettings";
import { IMAGE_URL } from "@src/constant/env";

interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ visible, onHide }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Mock user data - replace with actual user data from your store
  const user = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    avatar: null, // URL to user avatar
    createdAt: "2024-01-01",
  };

  const getInitials = () => {
    return `${user.firstName?.charAt(0) || ""}${
      user.lastName?.charAt(0) || ""
    }`;
  };

  return (
    <Dialog
      header="My Profile"
      visible={visible}
      style={{ width: "90vw", maxWidth: "900px", height: "90vh" }}
      onHide={onHide}
      dismissableMask
      draggable={false}
      resizable={false}
      className="user-profile-dialog"
    >
      <div className="user-profile-container">
        {/* User Header */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-6">
          <Avatar
            label={getInitials()}
            image={user.avatar ? `${IMAGE_URL}/${user.avatar}` : undefined}
            size="xlarge"
            shape="circle"
            className="w-16 h-16 text-xl font-bold bg-blue-500 text-white"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-500 text-sm">
              Member since {new Date(user.createdAt).getFullYear()}
            </p>
          </div>
          <Button
            icon="pi pi-pencil"
            label="Edit Profile"
            className="p-button-outlined p-button-sm"
            onClick={() => setActiveTab(3)} // Switch to settings tab
          />
        </div>

        {/* Tab Navigation */}
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
          className="user-profile-tabs"
        >
          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
            }
          >
            <MyOrders />
          </TabPanel>

          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Shipping Address</span>
              </div>
            }
          >
            <ShippingAddress />
          </TabPanel>

          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Payment Methods</span>
              </div>
            }
          >
            <PaymentMethods />
          </TabPanel>

          <TabPanel
            header={
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            }
          >
            <ProfileSettings />
          </TabPanel>
        </TabView>
      </div>

      <style>{`
        .user-profile-dialog .p-dialog-content {
          padding: 1.5rem;
        }
        
        .user-profile-tabs .p-tabview-nav {
          border-bottom: 2px solid #e5e7eb;
        }
        
        .user-profile-tabs .p-tabview-nav li .p-tabview-nav-link {
          padding: 1rem 1.5rem;
          font-weight: 500;
          border: none;
          background: transparent;
        }
        
        .user-profile-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link {
          border-bottom: 2px solid #3b82f6;
          color: #3b82f6;
        }
        
        .user-profile-tabs .p-tabview-panels {
          padding: 1.5rem 0;
        }
      `}</style>
    </Dialog>
  );
};

export default UserProfile;
