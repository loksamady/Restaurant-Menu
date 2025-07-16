import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
// import { useTranslation } from "react-i18next";
// import { useState } from "react";
import { faAdd, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import CreateDialog from "./components/CreateDialog";
// import MenuTable from "./components/MenuTable";

const MenuPage = () => {
  // const { t } = useTranslation("site");
  // const [visible, setVisible] = useState<boolean>(false);

  const headerActionButtons = () => {
    return (
      <Button
        label="New Menu"
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
        title="Menus"
        icon={faUtensils}
        actionContent={headerActionButtons()}
      />
      <div>
        {/* <MenuTable /> */}
        {/* <CreateDialog visible={visible} setVisible={setVisible} /> */}
      </div>
    </div>
  );
};

export default MenuPage;
