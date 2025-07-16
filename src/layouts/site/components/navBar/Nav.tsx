import { Link, useLocation } from "react-router-dom"; // Import useLocation hook
import { FC, useRef, useState } from "react";
import { NavMenuType } from "@src/types/menu";
import MobileNav from "./MobileNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
type PopoverPosition = {
  left?: number;
  right?: number;
};

type NavProps = {
  menuItems: NavMenuType[];
};

const Nav: FC<NavProps> = ({ menuItems }) => {
  const [hovering, setHovering] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({});
  const refs = useRef<(HTMLElement | null)[]>([]);
  const location = useLocation();

  const handleMouseEnter = (index: number, element: HTMLElement) => {
    setHovering(index);
    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const offset = 20;

    if (windowWidth >= 1280) {
      if (rect.left + 800 + offset > windowWidth) {
        setPopoverPosition({ right: windowWidth - rect.right + offset - 100 });
      } else {
        setPopoverPosition({ left: rect.left + offset });
      }
    } else {
      setPopoverPosition({ right: windowWidth - rect.right + offset - 25 });
    }
  };
  const isActive = (url?: string) => {
    if (!url) return false; // If no URL is provided, return false

    const getFirstTwoSegments = (path: string) => {
      const segments = path.split("/").filter(Boolean); // Split by '/', remove empty segments
      return segments.slice(0, 2).join("/"); // Join the first two segments back
    };

    const currentPath = getFirstTwoSegments(location.pathname);
    const targetPath = getFirstTwoSegments(url);

    return currentPath === targetPath;
  };

  const renderNavItem = (index: number, item: NavMenuType) =>
    item.items && item.items.length > 0 ? (
      <a
        onMouseEnter={(e) => handleMouseEnter(index, e.currentTarget)}
        className={`text-center text-sm font-medium leading-6 tracking-wide self-stretch hover:text-csx-color-2 ${
          isActive(item.url) ? "text-csx-color-2" : ""
        }`} // Apply active class
      >
        <span>{item.label}</span>
        {/* Add the dropdown icon if the item has child items */}
        <FontAwesomeIcon
          icon={faChevronDown}
          className="ml-2"
          size="sm"
          aria-hidden="true"
        />
      </a>
    ) : (
      <Link
        target={item.isOutSourceUrl ? "_blank" : ""}
        to={item.url || ""}
        onMouseEnter={(e) => handleMouseEnter(index, e.currentTarget)}
        className={`text-center text-sm font-medium leading-6 tracking-wide self-stretch hover:text-csx-color-2 ${
          location.pathname === item.url ? "text-csx-color-2" : ""
        }`} // Apply active class
      >
        {item.label}
      </Link>
    );

  const renderPopoverContent = (index: number, items: NavMenuType[]) => (
    <div className="relative">
      <div
        className={`w-full transition-all duration-300 p-8 ${
          hovering === index ? "opacity-100" : "opacity-100 pointer-events-none"
        } ${
          hovering === index
            ? "transform-none"
            : hovering! > index
            ? "-translate-x-24"
            : "translate-x-24"
        }`}
      >
        <ul
          className="text-black flex space-x-6" // First-level displayed in a row
          ref={(element) => (refs.current[index] = element)}
        >
          {items.map((item, idx) => {
            return (
              <li key={idx} className="cursor-pointer text-base min-w-[100px]">
                <div className="hover:text-gray-700 font-semibold pb-3">
                  {item.label}
                </div>
                {item.items && item.items.length > 0 && (
                  <ul className="flex flex-col space-y-1 mt-2 gap-2">
                    {item.items.map((child, childIdx) => (
                      <Link
                        target={child.isOutSourceUrl ? "_blank" : ""}
                        onClick={() => setHovering(null)}
                        to={child.url!}
                        key={childIdx}
                        className="cursor-pointer text-sm hover:text-csx-color-2 font-normal relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-csx-color-2 duration-300"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <MobileNav menuItems={menuItems} />
      <nav
        onMouseLeave={() => setHovering(null)}
        className="gap-8 2xl:text-lg text-sm font-bold text-gray-500 cursor-pointer hidden md:flex"
      >
        {menuItems.map((item, index) => (
          <div key={index}>
            {renderNavItem(index, item)}
            {item.items && item.items.length > 0 && hovering === index && (
              <div
                style={{
                  ...popoverPosition,
                }}
                className="absolute top-11 bg-white overflow-hidden transform-gpu rounded shadow-lg transition-all duration-300"
              >
                {renderPopoverContent(index, item.items)}
              </div>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};

export default Nav;
