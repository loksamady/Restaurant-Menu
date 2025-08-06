import React, { useState } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import UserProfile from "./UserProfile";

interface UserProps {
  onClick?: () => void;
}

const User: React.FC<UserProps> = ({ onClick }) => {
  const [showProfile, setShowProfile] = useState(false);

  // Mock user data - replace with actual user data from your auth store
  const user = {
    firstName: "John",
    lastName: "Doe",
    avatar: null, // URL to user avatar
  };

  const getInitials = () => {
    return `${user.firstName?.charAt(0) || ""}${
      user.lastName?.charAt(0) || ""
    }`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowProfile(true);
    }
  };

  return (
    <>
      <Button
        className="p-button-text p-button-rounded"
        onClick={handleClick}
        tooltip="My Profile"
        tooltipOptions={{ position: "bottom" }}
      >
        {user.avatar ? (
          <Avatar
            image={user.avatar}
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
