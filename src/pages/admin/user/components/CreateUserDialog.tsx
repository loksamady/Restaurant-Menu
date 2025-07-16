import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  CreateUserSchemaType,
  createUserSchema,
} from "@src/validationType/user";
import { createUser } from "@src/api/service/user.service";
import UserForm from "./UserForm";
import { useEffect } from "react";

type Props = {
  merchantId?: number | null;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  queryKey?: string;
  ownerOnly?: boolean;
};

const CreateUserDialog = ({
  merchantId,
  visible,
  setVisible,
  queryKey,
  ownerOnly = false,
}: Props) => {
  const queryClient = useQueryClient();

  const defaultValues = {
    username: "",
    password: "",
    merchantId: merchantId,
    roles: [],
  };

  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: defaultValues,
  });

  const handleReset = () => {
    form.reset(defaultValues);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreateUserSchemaType) {
    mutate(data);
  }

  useEffect(() => {
    form.setValue("merchantId", merchantId);
  }, [merchantId]);

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Create User" icon={faAdd} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "35vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <UserForm
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
        ownerOnly={ownerOnly}
      />
    </Dialog>
  );
};

export default CreateUserDialog;
