import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { UserType } from "@src/types/user";
import {
  UpdateAuthSchemaType,
  updateAuthSchema,
} from "@src/validationType/user";
import ConfirmDialogHeader from "@src/pages/admin/components/ConfirmDialogHeader";
import UpdateUserForm from "./UpdateUserForm";
import { updateAuthUser } from "@src/api/service/authService";

type Props = {
  user: UserType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const UpdateUserDialog = ({ user, visible, setVisible }: Props) => {
  const form = useForm<UpdateAuthSchemaType>({
    resolver: zodResolver(updateAuthSchema),
    defaultValues: {
      username: user.username!,
      password: "",
    },
  });

  const handleReset = () => {
    form.reset({ username: "", password: "" });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateAuthUser,
    onSuccess: () => {
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: UpdateAuthSchemaType) {
    mutate(data);
  }

  return (
    <Dialog
      header={<ConfirmDialogHeader title="User Profile" />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "30vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <UpdateUserForm
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
      />
    </Dialog>
  );
};

export default UpdateUserDialog;
