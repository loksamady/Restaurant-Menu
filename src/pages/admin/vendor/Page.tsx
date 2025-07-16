import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useState } from "react";
import { faAdd, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateDialog from "./components/CreateDialog";
import VendorTable from "./components/VendorTable";

const VendorPage = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const headerActionButtons = () => {
    return (
      <Button
        label="New Vendor"
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
        title="Vendors"
        icon={faStore}
        actionContent={headerActionButtons()}
      />
      <div>
        <VendorTable />
        <CreateDialog visible={visible} setVisible={setVisible} />
      </div>
    </div>
  );
};

export default VendorPage;
