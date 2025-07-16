import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useState } from "react";
import { faAdd, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getOwnerUsers } from "@src/api/service/user.service";
import useAuth from "@src/hooks/useAuth";
import { UsersResponseType } from "@src/types/user";
import { useQuery } from "@tanstack/react-query";
import ErrorCard from "@src/components/ErrorCard";
import UserTable from "./components/UserTable";
import CreateUserDialog from "./components/CreateCustomerDialog";

const CustomerPage = () => {
  const { isOwner } = useAuth();

  const [visible, setVisible] = useState<boolean>(false);

  const { data, isLoading, isError, error } =
    useQuery<UsersResponseType | null>({
      queryKey: ["owner-users"],
      queryFn: isOwner() ? () => getOwnerUsers() : undefined,
    });

  const headerActionButtons = () => {
    return (
      <Button
        label="New Customer"
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
        title="Customer"
        icon={faUsers}
        actionContent={headerActionButtons()}
      />
      <div>
        {data && (
          <UserTable
            userData={data}
            isLoading={isLoading}
            queryKey="owner-users"
            ownerOnly
          />
        )}
        <CreateUserDialog
          visible={visible}
          setVisible={setVisible}
          queryKey="owner-users"
          ownerOnly
        />
      </div>
    </div>
  );
};

export default CustomerPage;
