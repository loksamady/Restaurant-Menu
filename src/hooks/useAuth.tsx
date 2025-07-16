import { ROLE } from "@src/enum/role";
import { useAuthStore } from "@src/state/auth";

const useAuth = () => {
  const { auth } = useAuthStore();

  const isSuperAdmin = (): boolean => {
    return !!auth?.roles.find((role) => role === ROLE.SUPER_ADMIN);
  };

  const isOwner = (): boolean => {
    return !!auth?.roles.find((role) => role === ROLE.OWNER);
  };

  const isAdmin = (): boolean => {
    return !!auth?.roles.find((role) => role === ROLE.ADMIN);
  };

  const isStaff = (): boolean => {
    return !!auth?.roles.find((role) => role === ROLE.STAFF);
  };

  const isAuthorized = (): boolean => {
    return !!auth?.token;
    // && !!auth?.authUser?.enabled;
  };

  const hasRole = (roleKeys: string[]): boolean => {
    // if (isSuperAdmin()) return true;

    const roles = [];

    roleKeys.forEach((roleKey) => {
      const userRole =
        auth?.roles && auth?.roles.find((role) => role === roleKey);

      if (userRole) roles.push(userRole);
    });

    return roles.length > 0;
  };

  // const hasPermission = (permissionKeys: PERMISSION[]): boolean => {
  //   if (isSuperAdmin()) return true;

  //   const permissions = [];

  //   permissionKeys.forEach((permissionKey) => {
  //     const userRolePermission = authUser?.roleList.find((role) =>
  //       role.permissions.find(
  //         (permission) => permission?.name === permissionKey
  //       )
  //     );
  //     const userPermission = authUser?.additionalPermissionList.find(
  //       (permission) => permission?.name === permissionKey
  //     );

  //     if (userRolePermission) permissions.push(userRolePermission);
  //     if (userPermission) permissions.push(userPermission);
  //   });

  //   return permissions.length > 0;
  // };

  return { isSuperAdmin, isOwner, isAdmin, isStaff, isAuthorized, hasRole };
};

export default useAuth;
