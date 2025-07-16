import { Outlet } from "react-router-dom";
import AdminTopbar from "./AdminTopbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import { useResizeListener } from "primereact/hooks";
import { useEffect } from "react";
import useWindowStore from "@src/state/window";
import useAuth from "@src/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { MerchantOptionResponseType } from "@src/types/admin/merchant";
import { getMerchantOptions } from "@src/api/service/merchant.service";
import { useMerchantStore } from "@src/state/merchant";
import { getAdminCategoryOptions } from "@src/api/service/category.service";
import { CategoryOptionsResponseType } from "@src/types/category";
import { useCategoryStore } from "@src/state/category";
import { RolesResponseType } from "@src/types/role";
import { getRoles } from "@src/api/service/role.service";
import { useRoleStore } from "@src/state/role";

const AdminLayout = () => {
  const { setWindow } = useWindowStore();
  const { isOwner, isSuperAdmin, isAdmin } = useAuth();
  const { setOptions: setMerchantOptions } = useMerchantStore();
  const { setOptions: setCategoryOptions } = useCategoryStore();
  const { setOptions: setRoleOptions } = useRoleStore();

  const { data: merchantOptions } = useQuery<MerchantOptionResponseType>({
    queryKey: ["merchant-options"],
    queryFn: isOwner() ? getMerchantOptions : undefined,
  });

  const { data: categoryOptions } = useQuery<CategoryOptionsResponseType>({
    queryKey: ["category-options"],
    queryFn: !isSuperAdmin() ? getAdminCategoryOptions : undefined,
  });

  const { data: roleOptions } = useQuery<RolesResponseType>({
    queryKey: ["role-options"],
    queryFn: isOwner() || isAdmin() ? getRoles : undefined,
  });

  const [bindWindowResizeListener, unbindWindowResizeListener] =
    useResizeListener({
      listener: () => {
        setWindow({ width: window.innerWidth, height: window.innerHeight });
      },
    });

  useEffect(() => {
    bindWindowResizeListener();
    return () => unbindWindowResizeListener();
  }, [bindWindowResizeListener, unbindWindowResizeListener]);

  useEffect(() => {
    if (merchantOptions?.data) {
      const mappedMerchants = merchantOptions?.data.map((merchant) => {
        return { label: merchant?.name, value: merchant?.id };
      });
      setMerchantOptions(mappedMerchants);
    }
  }, [merchantOptions?.data]);

  useEffect(() => {
    if (categoryOptions?.data) {
      // const mappedCategories = categoryOptions?.data.map((category) => {
      //   return { label: category?.nameEn, value: category?.categoryId };
      // });
      setCategoryOptions(categoryOptions?.data);
    }
  }, [categoryOptions?.data]);

  useEffect(() => {
    if (roleOptions?.data) {
      const mappedRoles = roleOptions?.data.map((role) => {
        return { label: role?.name, value: role?.roleId };
      });
      setRoleOptions(mappedRoles);
    }
  }, [roleOptions?.data]);

  return (
    <div className="flex w-full h-screen">
      <AdminSidebar />
      <div className="relative overflow-y-auto w-full bg-slate-200 flex flex-col justify-between">
        <div className="">
          <AdminTopbar />
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
