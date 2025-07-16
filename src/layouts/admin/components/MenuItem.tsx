import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMenuStore from "@src/state/menu";
import { CustomRouteObject } from "@src/types/route";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  visibleSideBar?: boolean;
  item: CustomRouteObject;
  isChild?: boolean;
  setVisibleSideBar?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuItem = ({
  visibleSideBar,
  item,
  isChild,
  setVisibleSideBar,
}: Props) => {
  const location = useLocation();
  const { setActiveMenu } = useMenuStore();
  const { path, icon, label, children } = item;

  const [openMenu, setOpenMenu] = useState<boolean>(true);

  // Check if any child is active
  const isChildActive = children?.some(
    (child) => location.pathname === child.path
  );

  function onSelectMenu(item: CustomRouteObject) {
    if (!item.children || item.children.length === 0) {
      setActiveMenu(item);
      setVisibleSideBar && setVisibleSideBar(false);
    } else {
      setOpenMenu(!openMenu);
    }
  }

  const isActive = location.pathname === path;
  const isHighlightedChild = openMenu && isChildActive;
  const isMainItemActive = !isChild && isActive;

  const menuItemWithChildClassName = [
    "flex rounded-md text-white cursor-pointer gap-1 px-4 items-center duration-500",
    isActive ? "text-secondary" : "hover:text-secondary",
    isChild ? "py-2" : "py-1",
    visibleSideBar ? "justify-between" : "justify-center",
    isHighlightedChild && "bg-secondary-dark text-secondary-light",
    isMainItemActive && "bg-secondary-dark text-white",
  ]
    .filter(Boolean)
    .join(" ");

  const menuItemClassName = [
    "flex rounded-md text-white cursor-pointer gap-1 px-4 py-1 items-center duration-500",
    isActive ? "text-secondary" : "hover:text-secondary",
    visibleSideBar ? "justify-between" : "justify-center",
    isChildActive && "bg-secondary-dark text-secondary-light",
  ]
    .filter(Boolean)
    .join(" ");

  const activeChildClassName = [
    "absolute left-0 h-full border-l-2",
    isActive ? "border-secondary text-secondary" : "border-gray-400",
  ].join(" ");

  const iconClassName = ["h-full", isChild ? "text-xs ml-4" : "text-xl"].join(
    " "
  );

  const labelClassName = [
    "font-medium text-sm",
    visibleSideBar ? "block pl-2" : "hidden",
  ]
    .filter(Boolean)
    .join(" ");

  const iconTemplate = () => {
    return (
      visibleSideBar &&
      children &&
      children.length > 0 && (
        <FontAwesomeIcon
          icon={openMenu ? faChevronUp : faChevronDown}
          className="text-xs transform"
        />
      )
    );
  };

  const visibleMenuItemClassName = [
    "overflow-hidden",
    "transition-[max-height] transform duration-500 ease-in-out",
    "pl-4",
    isChild && "mt-1",
    openMenu ? "max-h-screen" : "max-h-0",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isChildActive) setOpenMenu(true);
  }, [location.pathname, isChildActive]);

  return (
    <>
      {item?.element && !item?.children ? (
        <Link
          to={item?.path || ""}
          className={menuItemWithChildClassName}
          onClick={() => onSelectMenu(item)}
        >
          <div className="flex items-center gap-2 relative">
            {isChild && <div className={activeChildClassName}></div>}
            <div className={iconClassName}>{icon}</div>
            <span
              className={`${labelClassName} ${
                isActive && isChild ? "text-secondary" : ""
              }`}
            >
              {label}
            </span>
          </div>

          {iconTemplate()}
        </Link>
      ) : (
        <Link
          to={item?.element ? item.path : "#"}
          className={
            item?.element ? menuItemWithChildClassName : menuItemClassName
          }
          onClick={() => onSelectMenu(item)}
        >
          <div className="flex items-center gap-2 relative">
            {isChild && <div className={activeChildClassName}></div>}
            <div className={iconClassName}>{icon}</div>
            <span className={labelClassName}>{label}</span>
          </div>

          {iconTemplate()}
        </Link>
      )}

      {visibleSideBar && (
        <ul className={visibleMenuItemClassName}>
          {children?.map((childItem, index) => (
            <MenuItem
              setVisibleSideBar={setVisibleSideBar}
              key={index}
              isChild={true}
              item={childItem}
              visibleSideBar={visibleSideBar}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default MenuItem;
