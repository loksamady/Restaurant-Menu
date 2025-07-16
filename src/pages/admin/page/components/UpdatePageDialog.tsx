import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageForm from "./PageForm";
import { PageTypeResponse } from "@src/types/page";
import { useEffect } from "react";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  adminGetPage,
  adminUpdatePage,
} from "@src/api/service/adminPageService";
import {
  CreatePageSchemaType,
  createPageSchema,
} from "@src/validationType/page";
import ErrorCard from "@src/components/ErrorCard";
import LoadingCard from "@src/components/LoadingCard";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  id: number;
  parentId?: number;
};

const UpdatePageDialog = ({ visible, setVisible, id }: Props) => {
  const { data, isLoading, isError } = useQuery<PageTypeResponse>({
    queryKey: ["adminPages", id],
    queryFn: () => adminGetPage(id),
  });
  const queryClient = useQueryClient();

  const form = useForm<CreatePageSchemaType>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      titleEn: "",
      titleKh: "",
      url: "",
      status: 1,
      descriptionEn: "",
      descriptionKh: "",
    },
  });

  const handleReset = () => {
    reset({
      titleEn: "",
      titleKh: "",
      status: 1,
      url: "",
      descriptionEn: "",
      descriptionKh: "",
    });
  };

  const { reset } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      updatePage,
      id,
    }: {
      updatePage: CreatePageSchemaType;
      id: number;
    }) => adminUpdatePage(updatePage, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPages"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: CreatePageSchemaType) {
    mutate({
      updatePage: data,
      id: id,
    });
  }

  useEffect(() => {
    if (data?.data) {
      const page = data.data;
      reset({
        titleEn: page.titleEn ?? "",
        titleKh: page.titleKh ?? "",
        descriptionEn: page.descriptionEn ?? "",
        descriptionKh: page.descriptionKh ?? "",
        status: page.status ?? 1,
        url: page.url ?? "",
        displayOrder: page.displayOrder ?? 0,
        parentId: page.parentId ?? undefined,
      });
    }
  }, [data?.data]);

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Update Page" icon={faFilePen} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      {isLoading ? (
        <LoadingCard />
      ) : isError ? (
        <ErrorCard />
      ) : (
        <PageForm
          form={form}
          handleSubmit={onSubmit}
          isLoading={isPending}
          id={id}
        />
      )}
    </Dialog>
  );
};

export default UpdatePageDialog;
