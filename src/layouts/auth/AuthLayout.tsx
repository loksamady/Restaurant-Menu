import useAuth from "@src/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthorized, isSuperAdmin, isOwner, isAdmin, isStaff } = useAuth();

  if (!isAuthorized()) return <Outlet />;

  if (isSuperAdmin()) return <Navigate to="/admin/vendors" />;

  if (isOwner() || isAdmin() || isStaff()) return <Navigate to="/admin" />;
};

export default AuthLayout;
