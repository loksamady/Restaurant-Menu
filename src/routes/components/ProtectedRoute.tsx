import useAuth from "@src/hooks/useAuth";
import useMenuStore from "@src/state/menu";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { adminRoutes } from "@src/routes/AdminRoute";
import { CustomRouteObject } from "@src/types/route";

const ProtectedRoute = () => {
  const { isAuthorized } = useAuth();
  const location = useLocation();
  const { setActiveMenu } = useMenuStore();

  const flattenRoutes = (routes: CustomRouteObject[]): CustomRouteObject[] => {
    const result: CustomRouteObject[] = [];

    routes.forEach((route) => {
      result.push(route);
      if (route.children) result.push(...flattenRoutes(route.children));
    });

    return result;
  };

  const routes = flattenRoutes(adminRoutes());

  useEffect(() => {
    // eslint-disable-next-line no-useless-escape
    const regex = /\/admin\/([^\/]+)/;
    const match = location?.pathname.match(regex);
    const currentPath = match?.input;
    const activeMenuFound = routes.find((route) => route.path === currentPath);

    activeMenuFound && setActiveMenu(activeMenuFound);
  }, [location, setActiveMenu]);

  return isAuthorized() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
