import { faImage, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import { useState } from "react";
import { MenuType, MenusResponseType } from "@src/types/menu";
import { deleteMenu } from "@src/api/service/menu.service";
import UpdateDialog from "./UpdateDialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterService } from "primereact/api";
import "./style.css";
import { Dropdown } from "primereact/dropdown";
import { CategoryType } from "@src/types/category";
import { Image } from "primereact/image";
import { IMAGE_URL } from "@src/constant/env";
import { useCategoryStore } from "@src/state/category";
import { Message } from "primereact/message";

FilterService.register("custom_categories", (value, filter) => {
  // `value` is expected to be an array of categories
  // `filter` is a single category object to match against

  if (filter == undefined) return true;

  if (!Array.isArray(value) || !filter) return false;

  return value.some(
    (category: CategoryType) =>
      category.categoryId === filter.categoryId ||
      category.nameEn === filter.name
  );
});

type Props = {
  menuData: MenusResponseType;
  isLoading: boolean;
};

const MenuTable = ({ menuData, isLoading }: Props) => {
  const { options: categoryOptions } = useCategoryStore();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    categories: { value: null, matchMode: FilterMatchMode.CUSTOM },
  });
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);

  const statusItemTemplate = (status: number) => {
    return status == null ? (
      <div>Select Status</div>
    ) : (
      <Tag
        value={status == 1 ? "Active" : "Inactive"}
        severity={getSeverity(status)}
      />
    );
  };

  const statusBodyTemplate = (row: MenuType) => {
    return (
      <Tag
        value={row.status == 1 ? "Active" : "Inactive"}
        severity={getSeverity(row.status)}
      />
    );
  };

  const getSeverity = (status: number | null) => {
    switch (status) {
      case 1:
        return "success";
      case 0:
        return "danger";
      default:
        return null;
    }
  };

  const actionTemplate = (row: MenuType) => {
    return (
      <div className="flex flex-row justify-center gap-2">
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faPen} />}
          severity="info"
          className="w-6 h-6 text-xs p-4"
          size="small"
          text
          onClick={() => {
            setUpdateVisible(true);
            setSelectedMenu(row);
          }}
        />
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faTrash} />}
          severity="danger"
          className="w-6 h-6 text-xs p-4"
          size="small"
          text
          onClick={() => {
            setDeleteVisible(true);
            setSelectedId(row?.menuId);
          }}
        />
      </div>
    );
  };

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
      categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
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
                placeholder="Search Menu"
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
            text="Info: Only active menu will be shown on website."
            className="w-full flex justify-start my-2 shadow-sm"
          />
        )}
      </>
    );
  };

  const selectedFilterStatusTemplate = (option: number) => {
    return statusItemTemplate(option);
  };

  const nameTemplate = (row: MenuType) => {
    const hasFiles = Array.isArray(row?.files) && row.files.length > 0;
    const fileName = hasFiles
      ? row?.files.find((file) => file.main)?.fileName ?? row?.files[0].fileName
      : null;

    return (
      <div className="flex items-center space-x-4">
        {hasFiles && fileName ? (
          <div className="w-16 h-16">
            <Image
              src={`${IMAGE_URL}/${fileName}`}
              alt="Image"
              imageClassName="w-full h-full object-cover"
              className="h-16 w-16"
              preview
            />
          </div>
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 border-round">
            <FontAwesomeIcon
              icon={faImage}
              className="text-gray-400 text-2xl"
            />
          </div>
        )}

        <div className="flex flex-col">
          {row?.hot && (
            <span className="text-red-500 font-semibold text-xs">
              🔥 Hot Menu
            </span>
          )}
          <span>{row?.nameEn}</span>
        </div>
      </div>
    );
  };

  const footer = `Total Menus: ${menuData?.data ? menuData.data.length : 0}`;

  return (
    <div className="p-6 bg-white rounded-md">
      {updateVisible && (
        <UpdateDialog
          visible={updateVisible}
          setVisible={setUpdateVisible}
          menu={selectedMenu!}
        />
      )}
      <ActionConfirmDialog
        id={selectedId!}
        dialogTitle="Confirm Delete Menu"
        dialogIcon={faTrash}
        dialogContent="Are you sure you want to delete this Menu?"
        queryKey="menus"
        mutationFn={deleteMenu}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
      />
      <DataTable
        footer={footer}
        totalRecords={menuData?.data?.length || 0}
        filters={filters}
        header={renderHeader}
        globalFilterFields={["name", "code"]}
        size="small"
        loading={isLoading}
        value={menuData?.data}
        stripedRows
        rows={10}
        filterDisplay="menu"
        paginator
      >
        <Column
          field="menu_id"
          header="#"
          className="w-[5%]"
          align="center"
          body={(_, options) => options.rowIndex + 1}
        />
        <Column
          field="nameEn"
          header="Name EN"
          className="font-bold"
          sortable
          body={nameTemplate}
        />
        <Column
          field="nameKh"
          header="Name KH"
          className="font-bold"
          sortable
        />
        <Column
          field="nameCn"
          header="Name CN"
          className="font-bold"
          sortable
        />
        <Column
          field="code"
          header="Code"
          className="font-bold"
          align="center"
          sortable
        />
        <Column
          field="price"
          header="Price"
          align="center"
          sortable
          body={(data) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.price)
          }
        />
        <Column
          field="priceKh"
          header="Price KH"
          align="center"
          sortable
          body={(data) =>
            new Intl.NumberFormat("km-KH", {
              style: "currency",
              currency: "KHR",
            }).format(data.priceKh)
          }
        />
        <Column
          field="discount"
          header="Discount"
          align="center"
          sortable
          body={(data) => `${data.discount}%`}
        />
        <Column
          field="categories"
          header="Categories"
          filter
          showFilterMatchModes={false}
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={categoryOptions || []}
              onChange={(e) => options.filterApplyCallback(e.value)}
              optionLabel="nameEn"
              placeholder="Select Category"
              showClear
              className="p-column-filter"
            />
          )}
          body={(data: MenuType) =>
            data.categories.map((c) => c.nameEn).join(", ")
          }
        />
        <Column
          field="status"
          header="Status"
          filter
          showFilterMenu
          showFilterMatchModes={false}
          filterElement={(options) => (
            <Dropdown
              valueTemplate={selectedFilterStatusTemplate}
              value={options.value}
              options={[1, 0]}
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
        <Column body={actionTemplate} header="Action" align="center" />
      </DataTable>
    </div>
  );
};

export default MenuTable;
