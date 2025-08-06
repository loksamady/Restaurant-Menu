import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { faAdd, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import CreateDialog from "./components/CreateDialog";
import CategoryTable from "./components/CategoryTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { getAdminCategories } from "@src/api/service/category.service";
import { CategoriesResponseType } from "@src/types/category";

const CategoryPage = () => {
  const { t } = useTranslation("site");
  const [visible, setVisible] = useState<boolean>(false);

  // Fetch categories data
  const { data: categoryData, isLoading } = useQuery<CategoriesResponseType>({
    queryKey: ["admin-categories"],
    queryFn: () => getAdminCategories({ merchantId: 1 }), // Default merchant ID
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

  return (
    <div>
      <PageHeader
        title={t("Categories")}
        icon={faLayerGroup}
        actionContent={headerActionButtons()}
      />
      <div>
        {categoryData ? (
          <CategoryTable categoryData={categoryData} isLoading={isLoading} />
        ) : (
          <div className="text-center p-8">
            <p>Loading categories...</p>
          </div>
        )}
        <CreateDialog visible={visible} setVisible={setVisible} />
      </div>
    </div>
  );
};

export default CategoryPage;
