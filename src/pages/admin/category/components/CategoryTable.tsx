import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteCategory } from "@src/api/service/category.service";
import { CategoriesResponseType, CategoryType } from "@src/types/category";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import { useState } from "react";
import UpdateDialog from "./UpdateDialog";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "primereact/message";

type Props = {
  categoryData: CategoriesResponseType;
  isLoading: boolean;
};

const CategoryTable = ({ categoryData, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  const statusBodyTemplate = (row: CategoryType) => {
    return (
      <Tag
        value={row.status === 1 ? "Active" : "Inactive"}
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

  const actionTemplate = (row: CategoryType) => {
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
            setSelectedCategory(row);
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
            setSelectedId(row.categoryId);
          }}
        />
      </div>
    );
  };

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

  const selectedFilterStatusTemplate = (option: number) => {
    return statusItemTemplate(option);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
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
                placeholder="Search Category"
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
            text="Info: Only active category will be shown on website."
            className="w-full flex justify-start my-2 shadow-sm"
          />
        )}
      </>
    );
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const footer = `Total Categories: ${
    categoryData?.data ? categoryData?.data.length : 0
  }`;

  return (
    <div className="p-6 bg-white rounded-md">
      {updateVisible && (
        <UpdateDialog
          visible={updateVisible}
          setVisible={setUpdateVisible}
          category={selectedCategory!}
        />
      )}
      <ActionConfirmDialog
        id={selectedId!}
        dialogTitle="Confirm Delete Category"
        dialogIcon={faTrash}
        dialogContent="Are you sure you want to delete this category?"
        queryKey="categories"
        mutationFn={deleteCategory}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["category-options"] })
        }
      />
      <DataTable
        footer={footer}
        totalRecords={categoryData?.data?.length || 0}
        filters={filters}
        header={renderHeader}
        globalFilterFields={["name"]}
        size="small"
        loading={isLoading}
        value={categoryData?.data}
        stripedRows
        rows={10}
        filterDisplay="menu"
        paginator
      >
        <Column
          header="#"
          className="w-[5%]"
          align={"center"}
          body={(_, options) => options.rowIndex + 1}
        />
        <Column field="nameEn" header="English Name" align={"center"} />
        <Column field="nameKh" header="Khmer Name" align={"center"} />
        <Column field="nameCn" header="Chinese Name" align={"center"} />
        <Column field="displayOrder" header="Display Order" align={"center"} />
        <Column
          field="status"
          header="Status"
          className="w-[5%]"
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
        <Column header="Action" alignHeader="center" body={actionTemplate} />
      </DataTable>
    </div>
  );
};

export default CategoryTable;
