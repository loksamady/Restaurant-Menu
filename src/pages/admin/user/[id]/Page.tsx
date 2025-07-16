import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useState } from "react";
import { faAdd, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserTable from "../components/UserTable";
import CreateUserDialog from "../components/CreateUserDialog";
import useMenuStore from "@src/state/menu";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UsersResponseType } from "@src/types/user";
import { getUsers } from "@src/api/service/user.service";
import ErrorCard from "@src/components/ErrorCard";

const UserByMerchantPage = () => {
  const { activeMenu } = useMenuStore();
  const location = useLocation();
  const segments = location?.pathname.split("/");
  const id = segments[segments.length - 1];

  const [visible, setVisible] = useState<boolean>(false);

  const { data, isLoading, isError, error } = useQuery<UsersResponseType>({
    queryKey: ["users", id],
    queryFn: id ? () => getUsers({ merchantId: Number(id) }) : undefined,
  });

  const headerActionButtons = () => {
    return (
      <Button
        label="New User"
        icon={<FontAwesomeIcon icon={faAdd} className="mr-2" />}
        iconPos="right"
        className="h-10"
        size="small"
        onClick={() => setVisible(true)}
      />
    );
  };

  if (isError) return <ErrorCard message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Users:"
        remark={activeMenu?.label}
        tagValue={!activeMenu?.active ? "Inactive" : undefined}
        active={activeMenu?.active}
        icon={faUsers}
        actionContent={activeMenu?.active ? headerActionButtons() : undefined}
      />
      <div>
        {data && (
          <UserTable userData={data} isLoading={isLoading} queryKey="users" />
        )}
        <CreateUserDialog
          merchantId={id ? Number(id) : null}
          visible={visible}
          setVisible={setVisible}
          queryKey="users"
        />
      </div>
    </div>
  );
};

export default UserByMerchantPage;
