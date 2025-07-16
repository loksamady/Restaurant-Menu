import Logo from "@src/assets/Logo/logo-white.png";
import { useEffect, useState } from "react";
import { SCREEN_XL } from "@src/constant/admin/constant";
import MenuItem from "./components/MenuItem";
import useWindowStore from "@src/state/window";
import { adminRoutes } from "@src/routes/AdminRoute";
import useAuth from "@src/hooks/useAuth";
import { Link } from "react-router-dom";
import { Image } from "primereact/image";

const AdminSidebar = () => {
  const { hasRole } = useAuth();
  const { window } = useWindowStore();

  const [lockSideBar, setLockSideBar] = useState<boolean>(false);
  const [fullSideBar, setFullSideBar] = useState<boolean>(false);

  const menus = adminRoutes();

  useEffect(() => {
    if (window?.width <= SCREEN_XL - 100) setFullSideBar(false);
    else if (!lockSideBar) setFullSideBar(true);
  }, [window]);

  return (
    <div className="relative hidden lg:block lg:sticky top-0 h-full z-50 bg-slate-800">
      <button
        className="absolute top-4 p-1 z-50 -right-4 transform duration-300"
        onClick={() => {
          setFullSideBar(!fullSideBar);
          setLockSideBar(!lockSideBar);
        }}
      >
        <i
          className={`pi pi-angle-left bg-gray-300 p-2 rounded-full transform duration-500 ${
            !fullSideBar && "rotate-180"
          }`}
        />
      </button>

      <div
        className={`relative transform ease-in-out duration-500 overflow-y-auto h-full ${
          fullSideBar ? "w-80" : "w-24"
        }`}
      >
        <div className="flex items-center gap-6 p-6">
          <Link
            to="/"
            target="_blank"
            className="min-w-[48px] w-12 transition-none transform-none"
          >
            <Image alt="logo" src={Logo} width="48" height="48" />
          </Link>
          <div
            className={`font-semibold whitespace-nowrap text-white xl:text-sm 2xl:text-base transform duration-300 ${
              fullSideBar ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            ADMINISTRATOR
          </div>
        </div>

        <div className="flex flex-col w-full overflow-y-auto">
          <div className="w-full">
            <ul className="flex flex-col justify-center gap-y-2 px-2 py-4">
              {menus
                .filter((route) => !route.roles || hasRole(route.roles))
                .map((item, index) => (
                  <MenuItem
                    key={index}
                    item={item}
                    visibleSideBar={fullSideBar}
                  />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
