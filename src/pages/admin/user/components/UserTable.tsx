import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import { useState } from "react";
import { FilterMatchMode, FilterService } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { UserType, UsersResponseType } from "@src/types/user";
import { deleteUser } from "@src/api/service/user.service";
import UpdateUserDialog from "./UpdateUserDialog";
import { Dropdown } from "primereact/dropdown";
import { useAuthStore } from "@src/state/auth";
import { ROLE } from "@src/enum/role";
import { useRoleStore } from "@src/state/role";
import { Message } from "primereact/message";
import useAuth from "@src/hooks/useAuth";

FilterService.register("custom_roles", (value, filter) => {
  if (filter == undefined) return true;

  if (!Array.isArray(value) || !filter) return false;

  return value.some(
    (role) => role.roleId === filter.roleId || role.name === filter.name
  );
});

type Props = {
  userData: UsersResponseType;
  isLoading: boolean;
  queryKey?: string;
  ownerOnly?: boolean;
};

const UserTable = ({
  userData,
  isLoading,
  queryKey,
  ownerOnly = false,
}: Props) => {
  const { auth } = useAuthStore();
  const { hasRole } = useAuth();
  const { options: roleOptions } = useRoleStore();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    roles: { value: null, matchMode: FilterMatchMode.CUSTOM },
  });
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const actionTemplate = (row: UserType) => {
    const isSuperAdminUser = row?.roles.some(
      (role) => role.name === ROLE.SUPER_ADMIN
    );

    const mappedUserRole = row?.roles.map((role) => role.name || "");
    const hasSameRole = mappedUserRole && hasRole(mappedUserRole);
    const canUpdateOrDelete =
      !!auth?.authUser?.isBaseOwner ||
      (!row?.isBaseOwner &&
        !hasSameRole &&
        auth.authUser?.userId !== row?.userId &&
        !isSuperAdminUser);

    return canUpdateOrDelete ? (
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
            setSelectedUser(row);
          }}
        />

        {!row?.isBaseOwner && (
          <Button
            type="button"
            icon={<FontAwesomeIcon icon={faTrash} />}
            severity="danger"
            className="w-6 h-6 text-xs p-4"
            size="small"
            text
            onClick={() => {
              setDeleteVisible(true);
              setSelectedId(row?.userId);
            }}
          />
        )}
      </div>
    ) : (
      <p></p>
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
                placeholder="Search User"
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
            text="Info: Only active user is able to login system."
            className="w-full flex justify-start my-2 shadow-sm"
          />
        )}
      </>
    );
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      roles: { value: null, matchMode: FilterMatchMode.CUSTOM },
    });
    setGlobalFilterValue("");
  };

  const footer = `Total Users: ${userData?.data ? userData?.data.length : 0}`;

  return (
    <div className="p-6 bg-white rounded-md">
      {updateVisible && (
        <UpdateUserDialog
          visible={updateVisible}
          setVisible={setUpdateVisible}
          user={selectedUser!}
          queryKey={queryKey}
          ownerOnly={ownerOnly}
        />
      )}
      <ActionConfirmDialog
        id={selectedId!}
        dialogTitle="Confirm Delete User"
        dialogIcon={faTrash}
        dialogContent="Are you sure you want to delete this user?"
        queryKey="users"
        mutationFn={deleteUser}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
      />
      <DataTable
        footer={footer}
        totalRecords={userData?.data?.length || 0}
        filters={filters}
        header={renderHeader}
        globalFilterFields={["username"]}
        size="small"
        loading={isLoading}
        value={userData?.data}
        stripedRows
        rows={10}
        filterDisplay="menu"
        paginator
        rowClassName={(data) => {
          return auth?.authUser?.userId === data?.userId
            ? "text-primary font-medium"
            : "";
        }}
      >
        <Column
          header="#"
          className="w-[5%]"
          body={(_, options) => options.rowIndex + 1}
        />
        <Column field="username" header="Username" className="font-bold" />
        <Column
          field="roles"
          header="Role"
          filter
          showFilterMatchModes={false}
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={roleOptions || []}
              onChange={(e) => options.filterApplyCallback(e.value)}
              optionLabel="name"
              placeholder="Select Role"
              showClear
              className="p-column-filter"
            />
          )}
          body={(data: UserType) => data.roles.map((r) => r.name).join(", ")}
        />
        <Column body={actionTemplate} header="Action" alignHeader="center" />
      </DataTable>
    </div>
  );
};

export default UserTable;
