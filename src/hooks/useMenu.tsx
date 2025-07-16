import { faGauge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminMenuItem } from "@src/types/admin/menu";
import { useNavigate } from "react-router-dom";

function useMenu(): AdminMenuItem[] {
  const navigate = useNavigate();

  const menuItems: AdminMenuItem[] = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faGauge} />,
      command: () => navigate("/admin"),
    },
  ];

  return menuItems;
}

export default useMenu;
