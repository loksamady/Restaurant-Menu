import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { faAdd, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import CreateDialog from "./components/CreateDialog";
import CategoryTable from "./components/CategoryTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CategoryPage = () => {
  const { t } = useTranslation("site");
  const [visible, setVisible] = useState<boolean>(false);

  const headerActionButtons = () => {
    return (
      <Button
        label="New Category"
        icon={<FontAwesomeIcon icon={faAdd} className="mr-2" />}
        iconPos="right"
        className="h-10"
        size="small"
        // onClick={() => setVisible(true)}
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
        <CategoryTable />
        <CreateDialog visible={visible} setVisible={setVisible} />
      </div>
    </div>
  );
};

export default CategoryPage;
