import { Dialog } from "primereact/dialog";
import RegisterForm from "@src/api/service/site/customerRegistration.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCustomerSchema,
  CreateCustomerSchemaType,
} from "@src/validationType/customer";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerCustomer } from "@src/api/service/site/customerRegistration.service";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const RegisterCustomerDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const queryClient = useQueryClient();

  const defaultValues: CreateCustomerSchemaType = {
    username: "",
    phone_number: "",
    address: "",
    telegram_id: "",
    telegram_username: "",
  };

  const form = useForm<CreateCustomerSchemaType>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setVisible(false);
    },
  });

  const onSubmit = (data: CreateCustomerSchemaType) => {
    mutate(data);
  };

  return (
    <Dialog
      header="Register Customer"
      visible={visible}
      onHide={() => setVisible(false)}
    >
      <RegisterForm form={form} handleSubmit={onSubmit} isLoading={isPending} />
    </Dialog>
  );
};

export default RegisterCustomerDialog;
