import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  CreateMenuSchemaType,
  createMenuSchema,
} from "@src/validationType/menu";
import MenuForm from "./MenuForm";
import { createMenu } from "@src/api/service/menu.service";
import { useEffect } from "react";

type Props = {
  merchantId?: number | null;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const CreateDialog = ({ merchantId, visible, setVisible }: Props) => {
  const queryClient = useQueryClient();

  const defaultValues = {
    nameEn: "",
    nameKh: "",
    nameCn: "",
    code: "",
    descriptionEn: "",
    descriptionKh: "",
    descriptionCn: "",
    price: 0,
    priceKh: 0,
    discount: 0,
    status: 1,
    categories: [],
    files: [],
    hot: false,
    merchantId: merchantId,
  };

  const form = useForm<CreateMenuSchemaType>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: defaultValues,
  });

  const handleReset = () => {
    form.reset(defaultValues);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreateMenuSchemaType) {
    mutate(data);
  }

  useEffect(() => {
    form.setValue("merchantId", merchantId);
  }, [merchantId]);

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Create Menu" icon={faAdd} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "40vw" }}
      breakpoints={{ "1281px": "60vw", "1025px": "80vw", "641px": "100vw" }}
    >
      <MenuForm
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
        merchantId={merchantId}
      />
    </Dialog>
  );
};

export default CreateDialog;
