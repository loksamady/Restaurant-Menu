import { Dialog } from "primereact/dialog";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import { VendorType } from "@src/types/admin/vendor";
import { DataTable } from "primereact/datatable";
import {
  EMPTY,
  LIMIT_PER_PAGE,
  ROWS_PER_PAGE_OPTION,
} from "@src/constant/admin/constant";
import { Column } from "primereact/column";
import { MerchantType } from "@src/types/admin/merchant";
import { DEFAULT_LANG } from "@src/hooks/useUrlLng";
import { Tag } from "primereact/tag";
import { formatLocalDateTime } from "@src/util/dateUtil";

type Props = {
  vendor: VendorType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const MerchantTableDialog = ({ vendor, visible, setVisible }: Props) => {
  const fullUrlSplitted = window?.location?.href
    ? window?.location?.href.split("/admin")
    : null;

  const slugTemplate = (row: MerchantType) => {
    const merchantUrl =
      row?.slug && fullUrlSplitted && fullUrlSplitted?.length > 0
        ? `${fullUrlSplitted[0]}/${DEFAULT_LANG}/${row?.slug}`
        : row?.slug;

    return (
      <p
        className="cursor-pointer text-primary underline hover:text-primary-light"
        onClick={() => {
          row?.slug && window.open(merchantUrl, "_blank");
        }}
      >
        {merchantUrl}
      </p>
    );
  };

  const statusBodyTemplate = (row: MerchantType) => {
    return (
      <Tag
        value={row.active ? "Active" : "Inactive"}
        severity={row.active ? "success" : "danger"}
      />
    );
  };

  const createdAtBodyTemplate = (row: MerchantType) => {
    return (
      <p>{row?.createdAt ? formatLocalDateTime(row?.createdAt) : EMPTY}</p>
    );
  };

  return (
    <Dialog
      header={
        <ConfirmDialogHeader
          title={`${vendor?.name}'s Merchant List`}
          icon={faAdd}
        />
      }
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      style={{ width: "60vw" }}
      breakpoints={{ "1281px": "80vw", "641px": "100vw" }}
    >
      <DataTable
        value={vendor?.merchants || []}
        size="small"
        stripedRows
        scrollable
        scrollHeight="65vh"
        tableStyle={{ minWidth: "10rem" }}
        rows={LIMIT_PER_PAGE}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTION}
        paginator
      >
        <Column field="id" header="ID" className="w-[5%]" align="center" />
        <Column field="name" header="Name" align="center" />
        <Column field="primaryPhone" header="Primary Phone" align="center" />
        <Column
          field="secondaryPhone"
          header="Secondary Phone"
          align="center"
        />
        <Column field="slug" header="Slug" align="center" body={slugTemplate} />
        <Column
          field="active"
          header="Status"
          align="center"
          className="w-[5%]"
          body={statusBodyTemplate}
        />
        <Column
          field="createdAt"
          header="Created Date"
          align="center"
          sortable
          body={createdAtBodyTemplate}
        />
      </DataTable>
    </Dialog>
  );
};

export default MerchantTableDialog;
