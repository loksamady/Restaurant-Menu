import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import { UserType } from "@src/types/user";
import {
  UpdateUserSchemaType,
  updateUserSchema,
} from "@src/validationType/user";
import { updateUser } from "@src/api/service/user.service";
import UpdateUserForm from "./UpdateUserForm";

type Props = {
  user: UserType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  queryKey?: string;
  ownerOnly?: boolean;
};

const UpdateUserDialog = ({
  user,
  visible,
  setVisible,
  queryKey,
  ownerOnly = false,
}: Props) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user.username!,
      password: "",
      merchantId: user?.merchantId || null,
      roles: user.roles.map((role) => role.roleId!),
    },
  });

  const handleReset = () => {
    form.reset({ username: "", password: "", merchantId: null });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ user, id }: { user: UpdateUserSchemaType; id: number }) =>
      updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: UpdateUserSchemaType) {
    mutate({ user: data, id: user.userId! });
  }

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Update User" icon={faEdit} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "35vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <UpdateUserForm
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
        ownerOnly={ownerOnly}
      />
    </Dialog>
  );
};

export default UpdateUserDialog;
