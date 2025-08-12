import React, { useState } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import UserProfile from "./UserProfile";

interface UserProps {
  onClick?: () => void;
}

const User: React.FC<UserProps> = ({ onClick }) => {
  const [showProfile, setShowProfile] = useState(false);

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
        <Avatar
          label="U"
          size="normal"
          shape="circle"
          className="w-8 h-8 bg-blue-500 text-white text-sm font-medium"
        />
      </Button>

      <UserProfile visible={showProfile} onHide={() => setShowProfile(false)} />
    </>
  );
};

export default User;
