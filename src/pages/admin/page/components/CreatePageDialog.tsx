import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PageForm from "./PageForm";

import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import {
  CreatePageSchemaType,
  createPageSchema,
} from "@src/validationType/page";
import { adminCreatePage } from "@src/api/service/adminPageService";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  parentId?: number;
};

const CreatePageDialog = ({ visible, setVisible }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm<CreatePageSchemaType>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      titleEn: "",
      titleKh: "",
      url: "",
      status: 1,
      displayOrder: 0,
      descriptionEn: "",
      descriptionKh: "",
    },
  });

  const handleReset = () => {
    reset({
      titleEn: "",
      titleKh: "",
      status: 1,
      displayOrder: 0,
      url: "",
      descriptionEn: "",
      descriptionKh: "",
    });
  };

  const { reset } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: adminCreatePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPages"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreatePageSchemaType) {
    mutate(data);
  }

  return (
    <Dialog
      header={
        <ConfirmDialogHeader title="Create Page" icon={faFileCirclePlus} />
      }
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <PageForm form={form} handleSubmit={onSubmit} isLoading={isPending} />
    </Dialog>
  );
};

export default CreatePageDialog;
