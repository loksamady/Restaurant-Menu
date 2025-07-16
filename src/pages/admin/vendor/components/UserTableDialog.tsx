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
import { Tag } from "primereact/tag";
import { formatLocalDateTime } from "@src/util/dateUtil";
import { UserDetailType } from "@src/types/user";

type Props = {
  vendor: VendorType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const UserTableDialog = ({ vendor, visible, setVisible }: Props) => {
  const statusBodyTemplate = (row: UserDetailType) => {
    return (
      <Tag
        value={row?.status ? "Active" : "Inactive"}
        severity={row?.status ? "success" : "danger"}
      />
    );
  };

  const baseOwnerBodyTemplate = (row: UserDetailType) => {
    return (
      <Tag
        value={row?.isBaseOwner ? "Yes" : "No"}
        severity={row?.isBaseOwner ? "success" : "danger"}
      />
    );
  };

  const referralIdBodyTemplate = (row: UserDetailType) => {
    return <p>{row?.referralId ? row?.referralId : EMPTY}</p>;
  };

  const createdAtBodyTemplate = (row: UserDetailType) => {
    return (
      <p>{row?.createdAt ? formatLocalDateTime(row?.createdAt) : EMPTY}</p>
    );
  };

  return (
    <Dialog
      header={
        <ConfirmDialogHeader
          title={`${vendor?.name}'s User List`}
          icon={faAdd}
        />
      }
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      style={{ width: "50vw" }}
      breakpoints={{ "1281px": "75vw", "641px": "100vw" }}
    >
      <DataTable
        value={vendor?.users || []}
        size="small"
        stripedRows
        scrollable
        scrollHeight="65vh"
        tableStyle={{ minWidth: "10rem" }}
        rows={LIMIT_PER_PAGE}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTION}
        paginator
      >
        <Column field="userId" header="ID" className="w-[5%]" align="center" />
        <Column field="username" header="Username" align="center" />
        <Column
          field="isBaseOwner"
          header="Base Owner"
          align="center"
          body={baseOwnerBodyTemplate}
        />
        <Column
          field="referralId"
          header="Referral ID"
          align="center"
          body={referralIdBodyTemplate}
        />
        <Column
          field="merchantId"
          header="Merchant ID"
          align="center"
          body={(data) => (data?.merchantId ? data?.merchantId : EMPTY)}
        />
        <Column
          field="status"
          header="Status"
          align="center"
          body={statusBodyTemplate}
        />
        <Column
          field="roles"
          header="Role"
          body={(data: UserDetailType) =>
            data.roles.map((r) => r.name).join(", ")
          }
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

export default UserTableDialog;
