import Home from "@src/pages/site/home/Home";
import NavigateToLogin from "@src/pages/site/Page";
import TestCheckout from "@src/pages/site/test/TestCheckout";
import TestCart from "@src/pages/site/test/TestCart";
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
    path: "/test-checkout",
    element: <TestCheckout />,
  },
  {
    path: "/test-cart",
    element: <TestCart />,
  },
  {
    path: "/:lng/:slug",
    element: <Home />,
  },
];
