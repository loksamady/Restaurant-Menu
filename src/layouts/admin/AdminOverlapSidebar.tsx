import { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import DevSphereLogo from "@src/assets/Logo/Logo.png";
import MenuItem from "./components/MenuItem";
import { SCREEN_LG } from "@src/constant/admin/constant";
import { adminRoutes } from "@src/routes/AdminRoute";
import useWindowStore from "@src/state/window";
import useAuth from "@src/hooks/useAuth";

export default function AdminOverlapSidebar() {
  const { hasRole } = useAuth();
  const { window } = useWindowStore();

  const [visible, setVisible] = useState<boolean>(false);

  const menus = adminRoutes();

  useEffect(() => {
    window?.width > SCREEN_LG ? setVisible(false) : setVisible(true);
  }, [window]);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        icon="pi pi-bars text-lg py-0"
        severity="secondary"
        text
        className="px-2 py-1 w-fit"
        onClick={() => setVisible(true)}
      />

      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        content={({ hide }) => (
          <div className="min-h-screen flex relative lg:static bg-gray-800">
            <div className="h-screen block shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 select-none w-full p-2">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 pt-3 shrink-0">
                  <div className="inline-flex items-center gap-4">
                    <a href="/" target="_blank">
                      <img
                        alt="logo"
                        className="max-h-7 min-w-12"
                        src={DevSphereLogo}
                      ></img>
                    </a>
                    <span className="font-semibold text-white">
                      ADMINISTRATOR
                    </span>
                  </div>
                  <Button
                    type="button"
                    icon="pi pi-times py-0"
                    severity="secondary"
                    text
                    className="px-2 py-1 w-fit"
                    onClick={(e) => hide(e)}
                  />
                </div>

                <div className="overflow-y-auto overflow-x-hidden">
                  <ul className="flex flex-col justify-center gap-y-1 px-2 py-4">
                    {menus
                      .filter((route) => !route.roles || hasRole(route.roles))
                      .map((item, index) => (
                        <MenuItem
                          key={index}
                          item={item}
                          visibleSideBar={visible}
                          setVisibleSideBar={setVisible}
                        />
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      ></Sidebar>
    </div>
  );
}
