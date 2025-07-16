import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import { MenuType } from "@src/types/menu";
import {
  CreateMenuSchemaType,
  createMenuSchema,
} from "@src/validationType/menu";
import { updateMenu } from "@src/api/service/menu.service";
import MenuForm from "./MenuForm";

type Props = {
  menu: MenuType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  parentId?: number;
};

const UpdateDialog = ({ menu, visible, setVisible }: Props) => {
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
    merchantId: null,
    setMainFileId: undefined,
  };

  const form = useForm<CreateMenuSchemaType>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      nameEn: menu.nameEn!,
      nameKh: menu.nameKh!,
      nameCn: menu.nameCn!,
      code: menu.code!,
      status: menu.status!,
      price: menu.price!,
      priceKh: menu.priceKh!,
      discount: menu.discount!,
      categories: menu.categories.map((category) => category.categoryId!),
      descriptionEn: menu.descriptionEn ?? "",
      descriptionKh: menu.descriptionKh ?? "",
      descriptionCn: menu.descriptionCn ?? "",
      files: [],
      setMainFileId:
        menu.files.find((file) => file.main)?.menuFileId ?? undefined,
      hot: menu.hot,
      merchantId: menu?.merchantId ?? null,
    },
  });

  const handleReset = () => {
    form.reset(defaultValues);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ menu, id }: { menu: CreateMenuSchemaType; id: number }) =>
      updateMenu(id, menu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreateMenuSchemaType) {
    mutate({ menu: data, id: menu.menuId! });
  }

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Update Menu" icon={faEdit} />}
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
        menu={menu}
        merchantId={menu?.merchantId}
      />
    </Dialog>
  );
};

export default UpdateDialog;
