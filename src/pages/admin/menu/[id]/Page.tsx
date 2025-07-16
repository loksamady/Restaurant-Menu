import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useState } from "react";
import { faAdd, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import MenuTable from "../components/MenuTable";
import CreateDialog from "../components/CreateDialog";
import { useQuery } from "@tanstack/react-query";
import { MenusResponseType } from "@src/types/menu";
import { getMenus } from "@src/api/service/menu.service";
import ErrorCard from "@src/components/ErrorCard";
import useMenuStore from "@src/state/menu";

const MenuByMerchantPage = () => {
  const { activeMenu } = useMenuStore();
  const location = useLocation();
  const segments = location?.pathname.split("/");
  const id = segments[segments.length - 1];

  const [visible, setVisible] = useState<boolean>(false);

  const { data, isLoading, isError, error } = useQuery<MenusResponseType>({
    queryKey: ["menus", id],
    queryFn: id ? () => getMenus({ merchantId: Number(id) }) : undefined,
  });

  const headerActionButtons = () => {
    return (
      <Button
        label="New Menu"
        icon={<FontAwesomeIcon icon={faAdd} className="mr-2" />}
        iconPos="right"
        className="h-10"
        size="small"
        onClick={() => setVisible(true)}
      />
    );
  };

  if (isError) return <ErrorCard message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Menus:"
        remark={activeMenu?.label}
        tagValue={!activeMenu?.active ? "Inactive" : undefined}
        active={activeMenu?.active}
        icon={faUtensils}
        actionContent={activeMenu?.active ? headerActionButtons() : undefined}
      />
      <div>
        {data && <MenuTable menuData={data} isLoading={isLoading} />}
        <CreateDialog
          merchantId={id ? Number(id) : null}
          visible={visible}
          setVisible={setVisible}
        />
      </div>
    </div>
  );
};

export default MenuByMerchantPage;
