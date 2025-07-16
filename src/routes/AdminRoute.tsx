import {
  faLayerGroup,
  faShop,
  faStore,
  faUsers,
  faUserTie,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ROLE } from "@src/enum/role";
import MerchantPage from "@src/pages/admin/merchant/Page";
import { CustomRouteObject } from "@src/types/route";
import VendorPage from "@src/pages/admin/vendor/Page";
import { useAuthStore } from "@src/state/auth";
import MenuByMerchantPage from "@src/pages/admin/menu/[id]/Page";
import CategoryByMerchantPage from "@src/pages/admin/category/[id]/Page";
import UserByMerchantPage from "@src/pages/admin/user/[id]/Page";
import MessageInfoCard from "@src/components/MessageInfoCard";
import UserPage from "@src/pages/admin/user/Page";
import CustomerPage from "@src/pages/admin/customer/Page";

export const adminRoutes = (): Array<CustomRouteObject> => {
  const authUser = useAuthStore.getState().auth.authUser;

  const menuItemChildrenByMerchants = (
    parentPath: string,
    element: JSX.Element
  ) => {
    return authUser?.merchants
      ? authUser?.merchants.map((merchant) => {
          return {
            path: `${parentPath}/${merchant?.id}`,
            element: element,
            label: merchant?.name,
            active: merchant?.active,
          };
        })
      : [];
  };

  return [
    {
      path: "/admin",
      label: "Menus",
      element:
        menuItemChildrenByMerchants("/admin", <MenuByMerchantPage />).length ===
        0 ? (
          <MessageInfoCard message="Please create merchant in order to create menu." />
        ) : undefined,
      icon: <FontAwesomeIcon icon={faUtensils} />,
      roles: [ROLE.OWNER, ROLE.ADMIN, ROLE.STAFF],
      children: menuItemChildrenByMerchants("/admin", <MenuByMerchantPage />),
    },
    {
      path: "/admin/categories",
      label: "Categories",
      element:
        menuItemChildrenByMerchants(
          "/admin/categories",
          <CategoryByMerchantPage />
        ).length === 0 ? (
          <MessageInfoCard message="Please create merchant in order to create category." />
        ) : undefined,
      icon: <FontAwesomeIcon icon={faLayerGroup} />,
      roles: [ROLE.OWNER, ROLE.ADMIN, ROLE.STAFF],
      children: menuItemChildrenByMerchants(
        "/admin/categories",
        <CategoryByMerchantPage />
      ),
    },
    {
      path: "/admin/users",
      label: "Users",
      element:
        menuItemChildrenByMerchants("/admin/users", <UserByMerchantPage />)
          .length === 0 ? (
          <MessageInfoCard message="Please create merchant in order to create user." />
        ) : undefined,
      icon: <FontAwesomeIcon icon={faUsers} />,
      roles: [ROLE.OWNER, ROLE.ADMIN],
      children: menuItemChildrenByMerchants(
        "/admin/users",
        <UserByMerchantPage />
      ),
    },
    {
      path: "/admin/users/owners",
      element: <UserPage />,
      label: "Owners",
      icon: <FontAwesomeIcon icon={faUserTie} />,
      roles: [ROLE.OWNER],
    },
    {
      path: "/admin/users/customers",
      element: <CustomerPage />,
      label: "Customers",
      icon: <FontAwesomeIcon icon={faUserTie} />,
      roles: [ROLE.OWNER],
    },
    {
      path: "/admin/merchants",
      element: <MerchantPage />,
      label: "Merchants",
      icon: <FontAwesomeIcon icon={faShop} />,
      roles: [ROLE.OWNER],
    },
    {
      path: "/admin/vendors",
      element: <VendorPage />,
      label: "Vendors",
      icon: <FontAwesomeIcon icon={faStore} />,
      roles: [ROLE.SUPER_ADMIN],
    },
  ];
};
