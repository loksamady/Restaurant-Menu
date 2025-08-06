import React, { useState } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import UserProfile from "./UserProfile";
import { useTelegramWebApp } from "@src/hooks/useTelegramWebApp";

interface UserProps {
  onClick?: () => void;
}

const User: React.FC<UserProps> = ({ onClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { user: telegramUser, isReady, isLoading, error } = useTelegramWebApp();

  // Get user initials
  const getInitials = () => {
    if (!telegramUser) return "U";
    return `${telegramUser.first_name?.charAt(0) || ""}${
      telegramUser.last_name?.charAt(0) || ""
    }`;
  };

  // Get user display name
  const getDisplayName = () => {
    if (!telegramUser) return "User";
    return `${telegramUser.first_name} ${telegramUser.last_name || ""}`.trim();
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowProfile(true);
    }
  };

  // Show loading state while initializing
  if (isLoading || !isReady) {
    return (
      <Button
        className="p-button-text p-button-rounded"
        disabled
        tooltip="Loading..."
        tooltipOptions={{ position: "bottom" }}
      >
        <Avatar
          icon="pi pi-spin pi-spinner"
          size="normal"
          shape="circle"
          className="w-8 h-8 bg-gray-300 text-gray-600"
        />
      </Button>
    );
  }

  // Show error state if there's an error
  if (error) {
    console.error("Telegram WebApp Error:", error);
    // Still show the component but with fallback data
  }

  return (
    <>
      <Button
        className="p-button-text p-button-rounded"
        onClick={handleClick}
        tooltip={`${getDisplayName()} - My Profile`}
        tooltipOptions={{ position: "bottom" }}
      >
        {telegramUser?.photo_url ? (
          <Avatar
            image={telegramUser.photo_url}
            size="normal"
            shape="circle"
            className="w-8 h-8"
          />
        ) : (
          <Avatar
            label={getInitials()}
            size="normal"
            shape="circle"
            className="w-8 h-8 bg-blue-500 text-white text-sm font-medium"
          />
        )}
      </Button>

      <UserProfile visible={showProfile} onHide={() => setShowProfile(false)} />
    </>
  );
};

export default User;
