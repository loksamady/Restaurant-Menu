import {
  faBars,
  faChevronDown,
  faChevronUp,
  faClose,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LngLink from "@src/components/LngLink";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { FC, useEffect, useState } from "react";
import Logo from "@src/assets/Logo/Logo.png";
import { NavMenuType } from "@src/types/menu";
import { Link, useLocation } from "react-router-dom";
import SiteMapDialog from "../siteMap/SiteMapDialog";

// Utility function to check if any child URL matches the current location
const isChildActive = (items: NavMenuType[], pathname: string): boolean => {
  return items.some((item) => {
    if (item.url === pathname) return true;
    if (item.items) return isChildActive(item.items, pathname);
    return false;
  });
};

const MenuItem: FC<{
  item: NavMenuType;
  isOpen: boolean;
  level: number;
  handleToggle: (id: string) => void;
  closeSidebar: () => void;
}> = ({ item, isOpen, level, handleToggle, closeSidebar }) => {
  const location = useLocation();
  const isActive = location.pathname === item.url;

  // Define styles based on the level
  const getFontSize = (level: number) => {
    switch (level) {
      case 2:
        return "text-base"; // Smaller font for second child
      case 3:
        return "text-sm"; // Even smaller font for third child
      default:
        return "text-lg"; // Default font size for top-level
    }
  };

  const getFontColor = (level: number) => {
    switch (level) {
      case 2:
      case 3:
        return isActive ? "text-csx-color-2" : "text-gray-600"; // Gray for second and third child levels
      default:
        return isActive ? "text-csx-color-2" : "text-black"; // Black for top-level
    }
  };

  return (
    <li className="cursor-pointer">
      <div
        className="flex items-center justify-between"
        onClick={() => handleToggle(item.id!)}
      >
        {/* If there are nested items, don't wrap in <Link> */}
        {item.items ? (
          <p
            className={`font-semibold cursor-pointer ${getFontSize(
              level
            )} ${getFontColor(level)}`}
          >
            {item.label}
          </p>
        ) : (
          <Link
            to={item.url!}
            className={`font-semibold cursor-pointer ${getFontSize(
              level
            )} ${getFontColor(level)}`}
            onClick={closeSidebar}
          >
            {item.label}
          </Link>
        )}

        {/* Render dropdown arrow if the item has subitems */}
        {item.items && item.items.length > 0 && (
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="text-xs"
          />
        )}
      </div>

      {/* Submenu rendering */}
      {item.items && item.items.length > 0 && (
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            transitionProperty: "max-height, opacity",
            marginLeft: `${level * 16}px`,
          }}
        >
          <MenuList
            items={item.items}
            level={level + 1}
            handleToggle={handleToggle}
            closeSidebar={closeSidebar}
          />
        </div>
      )}
    </li>
  );
};

// MenuList component to render a list of menu items
const MenuList: FC<{
  items: NavMenuType[];
  level: number;
  handleToggle: (id: string) => void;
  closeSidebar: () => void;
}> = ({ items, level, closeSidebar }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  // Auto open menu if a child matches location.pathname
  useEffect(() => {
    const initialOpenMenus: { [key: string]: boolean } = {};
    items.forEach((item) => {
      if (item.items && isChildActive(item.items, location.pathname)) {
        initialOpenMenus[item.id!] = true; // Auto-open parent if child matches
      }
    });
    setOpenMenus(initialOpenMenus);
  }, [items, location.pathname]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ul className="flex flex-col gap-3 mt-3">
      {items.map((item, index) => (
        <MenuItem
          key={item.id! + index}
          item={item}
          isOpen={!!openMenus[item.id!]}
          level={level}
          handleToggle={toggleMenu}
          closeSidebar={closeSidebar}
        />
      ))}
    </ul>
  );
};

type NavProps = {
  menuItems: NavMenuType[];
};

const MobileNav: FC<NavProps> = ({ menuItems }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const closeSidebar = () => setVisible(false);

  const [siteMapDialogVisible, setSiteMapDialogVisible] =
    useState<boolean>(false);
  return (
    <nav id="mobile-nav" className="md:hidden">
      <Sidebar
        visible={visible}
        onHide={closeSidebar}
        content={() => (
          <div className="p-6 flex flex-col h-full">
            <div className="mb-6 flex justify-between items-center">
              <LngLink to={""} onClick={closeSidebar}>
                <img src={Logo} className="w-16" />
              </LngLink>

              <FontAwesomeIcon
                onClick={closeSidebar}
                icon={faClose}
                className="text-2xl cursor-pointer"
              />
            </div>
            <div className="flex-1">
              {/* Render the menu items */}
              <MenuList
                items={menuItems}
                level={1}
                handleToggle={() => {}}
                closeSidebar={closeSidebar}
              />
            </div>

            <Button
              outlined
              label="SITE MAP"
              onClick={() => setSiteMapDialogVisible(true)}
              severity="info"
              size="small"
              icon={<FontAwesomeIcon icon={faSitemap} />}
            />
            <SiteMapDialog
              items={menuItems}
              visible={siteMapDialogVisible}
              setVisible={setSiteMapDialogVisible}
            />
          </div>
        )}
      ></Sidebar>
      <Button
        text
        onClick={() => setVisible(true)}
        severity="info"
        size="small"
        icon={<FontAwesomeIcon icon={faBars} />}
      />
    </nav>
  );
};

export default MobileNav;
