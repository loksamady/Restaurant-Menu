import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useState } from "react";
import { faAdd, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryTable from "../components/CategoryTable";
import CreateDialog from "../components/CreateDialog";
import { useQuery } from "@tanstack/react-query";
import { CategoriesResponseType } from "@src/types/category";
import { getAdminCategories } from "@src/api/service/category.service";
import useMenuStore from "@src/state/menu";
import { useLocation } from "react-router-dom";
import ErrorCard from "@src/components/ErrorCard";

const CategoryByMerchantPage = () => {
  const { activeMenu } = useMenuStore();
  const location = useLocation();
  const segments = location?.pathname.split("/");
  const id = segments[segments.length - 1];

  const [visible, setVisible] = useState<boolean>(false);

  const { data, isLoading, isError, error } = useQuery<CategoriesResponseType>({
    queryKey: ["categories", id],
    queryFn: id
      ? () => getAdminCategories({ merchantId: Number(id), orderBy: "asc" })
      : undefined,
  });

  const headerActionButtons = () => {
    return (
      <Button
        label="New Category"
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
        title="Categories:"
        remark={activeMenu?.label}
        tagValue={!activeMenu?.active ? "Inactive" : undefined}
        active={activeMenu?.active}
        icon={faLayerGroup}
        actionContent={activeMenu?.active ? headerActionButtons() : undefined}
      />
      <div>
        {data && <CategoryTable categoryData={data} isLoading={isLoading} />}
        <CreateDialog
          merchantId={id ? Number(id) : null}
          visible={visible}
          setVisible={setVisible}
        />
      </div>
    </div>
  );
};

export default CategoryByMerchantPage;
