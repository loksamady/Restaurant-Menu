import Home from "@src/pages/site/home/Home";
import NavigateToLogin from "@src/pages/site/Page";
import { CustomRouteObject } from "@src/types/route";

export const siteRoutes: CustomRouteObject[] = [
  {
    path: "/",
    element: <NavigateToLogin />,
  },
  {
    path: "/:lng",
    element: <NavigateToLogin />,
  },
  {
    path: "/:lng/:slug",
    element: <Home />,
  },
];
