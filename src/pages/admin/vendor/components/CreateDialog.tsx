import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import VendorForm from "./VendorForm";
import { useVendorStore } from "@src/state/vendor";
import {
  createSchema,
  CreateVendorSchemaType,
} from "@src/validationType/vendor";
import { createVendor } from "@src/api/service/vendor.service";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const CreateDialog = ({ visible, setVisible }: Props) => {
  const queryClient = useQueryClient();
  const { formData: defaultValues, resetFormData } = useVendorStore();

  const form = useForm<CreateVendorSchemaType>({
    resolver: zodResolver(createSchema),
    defaultValues: defaultValues,
  });

  const handleReset = () => {
    form.reset(defaultValues);
    resetFormData();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreateVendorSchemaType) {
    mutate(data);
  }

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Create Vendor" icon={faAdd} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "40vw" }}
      breakpoints={{ "1281px": "70vw", "641px": "100vw" }}
    >
      <VendorForm form={form} handleSubmit={onSubmit} isLoading={isPending} />
    </Dialog>
  );
};

export default CreateDialog;
