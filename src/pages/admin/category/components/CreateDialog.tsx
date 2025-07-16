import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  CreateCategorySchemaType,
  createCategorySchema,
} from "@src/validationType/category";
import { createCategory } from "@src/api/service/category.service";
import CategoryForm from "./CategoryForm";
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
    status: 1,
    displayOrder: undefined,
    merchantId: merchantId,
  };

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: defaultValues,
  });

  const handleReset = () => {
    form.reset(defaultValues);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-options"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreateCategorySchemaType) {
    mutate(data);
  }

  useEffect(() => {
    form.setValue("merchantId", merchantId);
  }, [merchantId]);

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Create Category" icon={faAdd} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "30vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <CategoryForm form={form} handleSubmit={onSubmit} isLoading={isPending} />
    </Dialog>
  );
};

export default CreateDialog;
