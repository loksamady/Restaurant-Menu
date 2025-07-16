import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import SiteMap from "./SiteMap";
import { NavMenuType } from "@src/types/menu";

type Props = {
  items: NavMenuType[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const SiteMapDialog = ({ items, visible, setVisible }: Props) => {
  const [siteMapVisible, setSiteMapVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => setSiteMapVisible(true), 100);
    } else {
      setSiteMapVisible(false);
    }
  }, [visible]);

  return (
    <div className=" flex justify-content-center">
      <Dialog
        header="SITE MAP"
        visible={visible}
        maximized={true}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        {siteMapVisible && <SiteMap items={items} setVisible={setVisible} />}
      </Dialog>
    </div>
  );
};

export default SiteMapDialog;
