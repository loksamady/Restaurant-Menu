import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import { useState } from "react";
import { VendorListResponseType, VendorType } from "@src/types/admin/vendor";
import { deleteVendor, getVendors } from "@src/api/service/vendor.service";
import {
  EMPTY,
  LIMIT_PER_PAGE,
  ROWS_PER_PAGE_OPTION,
} from "@src/constant/admin/constant";
import { formatLocalDateTime } from "@src/util/dateUtil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import UpdateDialog from "./UpdateDialog";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import MerchantTableDialog from "./MerchantTableDialog";
import UserTableDialog from "./UserTableDialog";

const VendorTable = () => {
  const [merchantDialogVisible, setMerchantDialogVisible] =
    useState<boolean>(false);
  const [userDialogVisible, setUserDialogVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const { data, isLoading } = useQuery<VendorListResponseType>({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const getSeverity = (status: boolean | null) => {
    switch (status) {
      case true:
        return "success";
      case false:
        return "danger";
      default:
        return null;
    }
  };

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const statusItemTemplate = (status: {
    label: string;
    value: boolean | null;
  }) => {
    return status?.value == null ? (
      <div>Select Status</div>
    ) : (
      <Tag
        value={status?.value ? "Active" : "Inactive"}
        severity={getSeverity(status?.value)}
      />
    );
  };

  const selectedFilterStatusTemplate = (option: {
    label: string;
    value: boolean | null;
  }) => {
    return statusItemTemplate(option);
  };

  const merchantLimitBodyTemplate = (row: VendorType) => {
    return (
      <p
        className="hover:text-primary cursor-pointer"
        onClick={() => {
          setSelectedVendor(row);
          setMerchantDialogVisible(true);
        }}
      >
        {row?.merchants?.length}
        <span> Shop(s) </span>
      </p>
    );
  };

  const userCountBodyTemplate = (row: VendorType) => {
    return (
      <p
        className="hover:text-primary cursor-pointer"
        onClick={() => {
          setSelectedVendor(row);
          setUserDialogVisible(true);
        }}
      >
        {row?.users.length ?? 0} <span> User(s) </span>
      </p>
    );
  };

  const statusBodyTemplate = (row: VendorType) => {
    return (
      <Tag
        value={row.status ? "Active" : "Inactive"}
        severity={row.status ? "success" : "danger"}
      />
    );
  };

  const actionTemplate = (row: VendorType) => {
    return (
      <div className="flex flex-row justify-center gap-2">
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faPen} />}
          severity="info"
          className="w-6 h-6 text-xs p-4"
          text
          onClick={() => {
            setUpdateVisible(true);
            setSelectedId(row.id);
          }}
        />
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faTrash} />}
          severity="danger"
          className="w-6 h-6 text-xs p-4"
          text
          onClick={() => {
            setDeleteVisible(true);
            setSelectedId(row.id);
          }}
        />
      </div>
    );
  };

  const createdAtBodyTemplate = (row: VendorType) => {
    return (
      <p>{row?.createdAt ? formatLocalDateTime(row?.createdAt) : EMPTY}</p>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center space-x-2 w-[100%] md:w-[60%] lg:w-[40%]">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          size="small"
          onClick={clearFilter}
        />
        <IconField iconPosition="left" className="w-full">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search Vendor"
            className="w-full text-sm"
          />
        </IconField>
      </div>
    );
  };

  const footer = `Total Vendors: ${data?.data ? data.data.length : 0}`;

  return (
    <div className="p-6 bg-white rounded-md">
      {updateVisible && (
        <UpdateDialog
          visible={updateVisible}
          setVisible={setUpdateVisible}
          id={selectedId!}
        />
      )}

      <ActionConfirmDialog
        id={selectedId!}
        dialogTitle="Confirm Delete Vendor"
        dialogIcon={faTrash}
        dialogContent="Are you sure you want to delete this vendor?"
        queryKey="vendors"
        mutationFn={deleteVendor}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
      />

      {selectedVendor && (
        <MerchantTableDialog
          visible={merchantDialogVisible}
          setVisible={setMerchantDialogVisible}
          vendor={selectedVendor}
        />
      )}

      {selectedVendor && (
        <UserTableDialog
          visible={userDialogVisible}
          setVisible={setUserDialogVisible}
          vendor={selectedVendor}
        />
      )}

      <DataTable
        value={data?.data || []}
        size="small"
        stripedRows
        scrollable
        scrollHeight="65vh"
        tableStyle={{ minWidth: "10rem" }}
        loading={isLoading}
        footer={footer}
        header={renderHeader}
        filters={filters}
        globalFilterFields={["name", "primaryPhone", "secondaryPhone", "slug"]}
        rows={LIMIT_PER_PAGE}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTION}
        paginator
      >
        <Column field="id" header="ID" className="w-[5%]" align="center" />
        <Column field="name" header="Name" align="center" />
        <Column
          field="merchantLimit"
          header="Merchant"
          align="center"
          body={merchantLimitBodyTemplate}
        />
        <Column
          field="status"
          header="Status"
          align="center"
          className="w-[5%]"
          filter
          showFilterMenu
          showFilterMatchModes={false}
          filterElement={(options) => (
            <Dropdown
              valueTemplate={selectedFilterStatusTemplate}
              value={options.value}
              options={statusOptions}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => options.filterApplyCallback(e.value)}
              itemTemplate={statusItemTemplate}
              placeholder="Select Status"
              className="p-column-filter"
              showClear
              style={{ minWidth: "12rem" }}
            />
          )}
          body={statusBodyTemplate}
        />
        <Column
          field="users"
          header="Users Count"
          align="center"
          body={userCountBodyTemplate}
        />
        <Column
          field="createdAt"
          header="Created Date"
          align="center"
          sortable
          body={createdAtBodyTemplate}
        />
        <Column body={actionTemplate} header="Action" alignHeader="center" />
      </DataTable>
    </div>
  );
};

export default VendorTable;
