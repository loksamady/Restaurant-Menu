import LanguageLayout from "@src/layouts/LanguageLayout";
import AdminLayout from "@src/layouts/admin/AdminLayout";
import AuthLayout from "@src/layouts/auth/AuthLayout";
import { CustomRouteObject } from "@src/types/route";
import { RouteObject } from "react-router-dom";
import { authRoutes } from "../routes/AuthRoute";
import { siteRoutes } from "../routes/SiteRoute";
import ProtectedRoute from "../routes/components/ProtectedRoute";
import { useMemo } from "react";
import { adminRoutes } from "@src/routes/AdminRoute";
import useDynamicRoutes from "./useDynamicRoutes";
import SiteDetailLayout from "@src/layouts/site/SiteDetailLayout";
import NotFound from "@src/components/Error/NotFound";
import useAuth from "./useAuth";

export const useRoute = () => {
  const { routes: dynamicRoutes, isLoading } = useDynamicRoutes();
  const { hasRole } = useAuth();

  const convertToRouteObject = (
    customRoutes: CustomRouteObject[]
  ): RouteObject[] => {
    return customRoutes
      .filter((route) => !route.roles || hasRole(route.roles))
      .map((route) => ({
        path: route.path,
        element: route.element,
        children: route.children
          ? convertToRouteObject(route.children)
          : undefined,
      }));
  };

  const routes = useMemo(
    (): RouteObject[] => [
      {
        element: <LanguageLayout />,
        children: [
          {
            // element: <SiteLayout />,
            children: [
              ...convertToRouteObject(siteRoutes),
              {
                element: <SiteDetailLayout />,
                children: [...dynamicRoutes!],
              },
            ],
          },
          {
            element: <ProtectedRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: convertToRouteObject(adminRoutes()),
              },
            ],
          },
          {
            element: <AuthLayout />,
            children: convertToRouteObject(authRoutes),
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
    [siteRoutes, adminRoutes(), authRoutes, dynamicRoutes]
  );

  return { routes, isLoading };
};
