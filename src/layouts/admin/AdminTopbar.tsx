import { Button } from "primereact/button";
import AdminOverlapSidebar from "./AdminOverlapSidebar";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@src/state/auth";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useRef, useState } from "react";
import UpdateUserDialog from "./components/UpdateUserDialog";
import { Divider } from "primereact/divider";
import useStoreState from "@src/hooks/useStoreState";

const AdminTopbar = () => {
  const { logout, auth } = useAuthStore();
  const { clearAllOptionsInStore } = useStoreState();

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const accept = () => {
    logout();
    navigate("/login");
    clearAllOptionsInStore();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const confirm2 = (event: any) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to log out?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      className: "font-medium",
      acceptClassName: "p-button-danger ml-2",
      accept,
    });
  };

  return (
    <div className="sticky top-0 w-full py-2 px-5 lg:px-8 z-30 bg-white flex items-center justify-between shadow-md">
      {updateVisible && (
        <UpdateUserDialog
          visible={updateVisible}
          setVisible={setUpdateVisible}
          user={auth.authUser!}
        />
      )}
      <Toast ref={toast} />
      <ConfirmPopup closeOnEscape />
      <AdminOverlapSidebar />
      <div className="w-full flex items-center justify-end">
        <div
          className="flex items-center gap-2 cursor-pointer transition font-bold"
          onClick={() => setUpdateVisible(true)}
        >
          <Avatar
            label={
              auth.authUser?.username ? auth.authUser?.username.charAt(0) : "O"
            }
            className="uppercase"
            size="xlarge"
            shape="circle"
          />
          <span className="text-sm text-primary hover:text-primary-light transform duration-300">
            {auth.authUser?.username}
          </span>
        </div>
        <Divider layout="vertical" className="py-2" />
        <Button
          label="Logout"
          className="py-2 text-sm text-red-500 font-semibold underline"
          unstyled
          onClick={confirm2}
        />
      </div>
    </div>
  );
};

export default AdminTopbar;
