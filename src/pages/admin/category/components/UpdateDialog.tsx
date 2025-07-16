import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  CreateCategorySchemaType,
  createCategorySchema,
} from "@src/validationType/category";
import { updateCategory } from "@src/api/service/category.service";
import CategoryForm from "./CategoryForm";
import { CategoryType } from "@src/types/category";

type Props = {
  category: CategoryType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const UpdateDialog = ({ category, visible, setVisible }: Props) => {
  const queryClient = useQueryClient();

  const defaultValues = {
    nameEn: "",
    nameKh: "",
    nameCn: "",
    status: 1,
    displayOrder: undefined,
    merchantId: null,
  };

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      nameEn: category.nameEn!,
      nameKh: category.nameKh!,
      nameCn: category.nameCn!,
      status: category.status!,
      displayOrder: category.displayOrder!,
      merchantId: category?.merchantId ?? null,
    },
  });

  const handleReset = () => {
    form.reset(defaultValues);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      category,
      id,
    }: {
      category: CreateCategorySchemaType;
      id: number;
    }) => updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-options"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreateCategorySchemaType) {
    mutate({ category: data, id: category.categoryId! });
  }

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Update Category" icon={faEdit} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "30vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <CategoryForm
        id={category.categoryId!}
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
      />
    </Dialog>
  );
};

export default UpdateDialog;
