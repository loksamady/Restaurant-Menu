import Login from "@src/pages/auth/Login";
import { CustomRouteObject } from "@src/types/route";

export const authRoutes: CustomRouteObject[] = [
  {
    path: "/login",
    element: <Login />,
    label: "Login",
  },
];
