import { Link } from "react-router-dom";
import { Divider } from "primereact/divider";
import { NavMenuType } from "@src/types/menu";

type Props = {
  items: NavMenuType[];
};

const SiteDetailMenu = ({ items }: Props) => {
  return (
    <ul>
      {items &&
        items.length > 0 &&
        items.map((item, index) => {
          return (
            <div key={index} className="cursor-pointer">
              <Link
                target={item.isOutSourceUrl ? "_blank" : ""}
                to={item.url || ""}
                className={`${
                  item.items &&
                  item.items.length === 0 &&
                  "hover:text-csx-color-2"
                } duration-300
                ${location.pathname === item.url && "text-csx-color-2"}
                ${item.items && item.items.length > 0 && "pointer-events-none"}
                `}
              >
                {item.label}
              </Link>
              {item.items && item.items.length > 0 && (
                <ul className="flex flex-col space-y-1 mt-2 gap-2 pl-4">
                  {item.items.map((child, childIdx) => (
                    <Link
                      target={child.isOutSourceUrl ? "_blank" : ""}
                      to={child.url || ""}
                      key={childIdx}
                      className={`pl-4 cursor-pointer text-sm hover:text-csx-color-2 font-normal relative before:content-['•'] before:absolute before:left-0 before:text-csx-color-2 ${
                        location.pathname === child.url && "text-csx-color-2"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </ul>
              )}
              <Divider className="my-2" />
            </div>
          );
        })}
    </ul>
  );
};

export default SiteDetailMenu;
