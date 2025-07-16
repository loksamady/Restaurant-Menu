import { faPalette, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import { useState } from "react";
import {
  MerchantListResponseType,
  MerchantType,
} from "@src/types/admin/merchant";
import { deleteMerchant } from "@src/api/service/merchant.service";
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
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_LANG } from "@src/hooks/useUrlLng";
import { Message } from "primereact/message";
import UpdateThemeDialog from "./UpdateThemeDialog";

type Props = {
  merchantData: MerchantListResponseType;
  isLoading: boolean;
};

const MerchantTable = ({ merchantData, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const fullUrlSplitted = window?.location?.href
    ? window?.location?.href.split("/admin")
    : null;

  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [updateThemeVisible, setUpdateThemeVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantType | null>(
    null
  );
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    active: { value: null, matchMode: FilterMatchMode.EQUALS },
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
      active: { value: null, matchMode: FilterMatchMode.EQUALS },
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

  const activeOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const statusItemTemplate = (active: {
    label: string;
    value: boolean | null;
  }) => {
    return active?.value == null ? (
      <div>Select Status</div>
    ) : (
      <Tag
        value={active?.value ? "Active" : "Inactive"}
        severity={getSeverity(active?.value)}
      />
    );
  };

  const slugTemplate = (merchant: MerchantType) => {
    const merchantUrl =
      merchant?.slug && fullUrlSplitted && fullUrlSplitted?.length > 0
        ? `${fullUrlSplitted[0]}/${DEFAULT_LANG}/${merchant?.slug}`
        : merchant?.slug;

    return (
      <p
        className="cursor-pointer text-primary underline hover:text-primary-light"
        onClick={() => {
          merchant?.slug && window.open(merchantUrl, "_blank");
        }}
      >
        {merchantUrl}
      </p>
    );
  };

  const selectedFilterStatusTemplate = (option: {
    label: string;
    value: boolean | null;
  }) => {
    return statusItemTemplate(option);
  };

  const statusBodyTemplate = (merchant: MerchantType) => {
    return (
      <Tag
        value={merchant.active ? "Active" : "Inactive"}
        severity={merchant.active ? "success" : "danger"}
      />
    );
  };

  const actionTemplate = (merchant: MerchantType) => {
    return (
      <div className="flex flex-row justify-center gap-3">
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faPalette} />}
          className="w-10 h-10 p-4"
          text
          onClick={() => {
            setUpdateThemeVisible(true);
            setSelectedId(merchant.id);
            setSelectedMerchant(merchant);
          }}
        />
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faPen} />}
          severity="info"
          className="w-10 h-10 p-4"
          text
          onClick={() => {
            setUpdateVisible(true);
            setSelectedId(merchant.id);
          }}
        />
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faTrash} />}
          severity="danger"
          className="w-10 h-10 p-4"
          text
          onClick={() => {
            setDeleteVisible(true);
            setSelectedId(merchant.id);
          }}
        />
      </div>
    );
  };

  const createdAtBodyTemplate = (row: MerchantType) => {
    return (
      <p>{row?.createdAt ? formatLocalDateTime(row?.createdAt) : EMPTY}</p>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2 w-full md:w-[60%] lg:w-[50%] xl:w-[40%]">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              outlined
              size="small"
              severity="secondary"
              tooltip="Clear Search"
              tooltipOptions={{ position: "bottom" }}
              onClick={clearFilter}
            />
            <IconField iconPosition="left" className="w-full">
              <InputIcon className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search Merchant"
                className="w-full text-sm"
              />
            </IconField>
          </div>
          <Button
            type="button"
            icon={showMessage ? "pi pi-times" : "pi pi-info-circle"}
            outlined
            size="small"
            tooltip="Info"
            tooltipOptions={{ position: "bottom" }}
            onClick={() => setShowMessage(!showMessage)}
          />
        </div>
        {showMessage && (
          <Message
            text="Info: Only active merchant will be shown on website."
            className="w-full flex justify-start my-2 shadow-sm"
          />
        )}
      </>
    );
  };

  const footer = `Total Merchants: ${
    merchantData?.data ? merchantData?.data.length : 0
  }`;

  return (
    <div className="p-6 bg-white rounded-md">
      {updateThemeVisible && (
        <UpdateThemeDialog
          merchantId={selectedId!}
          merchantLogo={selectedMerchant?.logo ?? ""}
          visible={updateThemeVisible}
          setVisible={setUpdateThemeVisible}
        />
      )}
      {updateVisible && (
        <UpdateDialog
          visible={updateVisible}
          setVisible={setUpdateVisible}
          id={selectedId!}
        />
      )}
      <ActionConfirmDialog
        id={selectedId!}
        dialogTitle="Confirm Delete Merchant"
        dialogIcon={faTrash}
        dialogContent="Are you sure you want to delete this merchant?"
        queryKey="merchants"
        mutationFn={deleteMerchant}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["merchant-auth"] })
        }
      />
      <DataTable
        value={merchantData?.data || []}
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
        // rowClassName={() => "hover:text-secondary-dark cursor-pointer"}
        // onRowDoubleClick={({ data }) => {
        //   data?.slug && window.open(data?.slug, "_blank");
        // }}
      >
        <Column
          field="id"
          header="#"
          className="w-[5%]"
          align="center"
          body={(_, options) => options.rowIndex + 1}
        />
        <Column field="name" header="Name" align="center" />
        {/* <Column field="address" header="Address" align="center" /> */}
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
          filter
          showFilterMenu
          showFilterMatchModes={false}
          filterElement={(options) => (
            <Dropdown
              valueTemplate={selectedFilterStatusTemplate}
              value={options.value}
              options={activeOptions}
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

export default MerchantTable;
