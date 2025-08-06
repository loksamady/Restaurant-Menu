import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Avatar } from "primereact/avatar";
import { User } from "lucide-react";
import { toast } from "sonner";

interface UserSettings {
  // Profile Info
  userId: string;
  userName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  avatar?: string;

  // Preferences
  language: string;
  timezone: string;
  currency: string;

  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;

  // Privacy
  profileVisibility: "public" | "private";
  dataSharing: boolean;
}

const ProfileSettings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    userId: "",
    userName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    avatar: "",
    language: "en",
    timezone: "UTC",
    currency: "USD",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    profileVisibility: "private",
    dataSharing: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSettings: UserSettings = {
      userId: "USR-12345678",
      userName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      dateOfBirth: "1990-01-01",
      avatar: undefined,
      language: "en",
      timezone: "UTC",
      currency: "USD",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderUpdates: true,
      promotions: false,
      profileVisibility: "private",
      dataSharing: false,
    };

    setTimeout(() => {
      setSettings(mockSettings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // API call to save profile settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  const handleAvatarUpload = (event: { files: File[] }) => {
    const file = event.files[0];
    if (file) {
      // In a real app, you'd upload to your server/cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings({ ...settings, avatar: e.target?.result as string });
        toast.success("Avatar updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    return `${settings.userName?.charAt(0) || ""}${
      settings.lastName?.charAt(0) || ""
    }`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Section */}
          <div className="md:col-span-2 flex items-center gap-4">
            <Avatar
              label={getInitials()}
              image={settings.avatar ? settings.avatar : undefined}
              size="xlarge"
              shape="circle"
              className="w-20 h-20 text-xl font-bold bg-blue-500 text-white"
            />
            <div>
              <h4 className="font-medium mb-2">Profile Picture</h4>
              <FileUpload
                mode="basic"
                accept="image/*"
                maxFileSize={1000000}
                onSelect={handleAvatarUpload}
                auto
                chooseLabel="Change Avatar"
                className="p-button-outlined p-button-sm"
              />
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 1MB</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">User ID</label>
            <InputText
              value={settings.userId}
              disabled
              className="w-full bg-gray-50"
              placeholder="Auto-generated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">User Name</label>
            <InputText
              value={settings.userName}
              disabled
              onChange={(e) =>
                setSettings({ ...settings, userName: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <InputText
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              type="email"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <InputText
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            label="Save Profile"
            icon="pi pi-check"
            loading={saving}
            onClick={handleSaveProfile}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettings;
