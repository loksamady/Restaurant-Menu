import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import PageTable from "./components/PageTable";
import CreateUpdatePageDialog from "./components/CreatePageDialog";
import { useState } from "react";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

const Page = () => {
  const { t } = useTranslation("site");
  const [visible, setVisible] = useState<boolean>(false);

  const headerActionButtons = () => {
    return (
      <Button
        label="New Page"
        icon="pi pi-file-plus"
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
        title={t("Pages")}
        icon={faFileLines}
        actionContent={headerActionButtons()}
      />
      <div className="max-w-screen-xl mx-auto py-4">
        <PageTable />
        <CreateUpdatePageDialog visible={visible} setVisible={setVisible} />
      </div>
    </div>
  );
};

export default Page;
