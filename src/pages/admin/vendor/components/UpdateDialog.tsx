import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  UpdateVendorSchemaType,
  updateSchema,
} from "@src/validationType/vendor";
import VendorForm from "./VendorForm";
import { VendorDetailResponseType } from "@src/types/admin/vendor";
import { useVendorStore } from "@src/state/vendor";
import { getVendor, updateVendor } from "@src/api/service/vendor.service";
import { useEffect } from "react";
import LoadingCard from "@src/components/LoadingCard";
import ErrorCard from "@src/components/ErrorCard";

type Props = {
  id: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const UpdateDialog = ({ id, visible, setVisible }: Props) => {
  const queryClient = useQueryClient();
  const { formData, resetFormData } = useVendorStore();

  const { data, isLoading, isError } = useQuery<VendorDetailResponseType>({
    queryKey: ["vendor", id],
    queryFn: () => getVendor(id),
  });

  const form = useForm<UpdateVendorSchemaType>({
    resolver: zodResolver(updateSchema),
    defaultValues: formData,
  });

  const handleReset = () => {
    form.reset(formData);
    resetFormData();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      vendor,
      id,
    }: {
      vendor: UpdateVendorSchemaType;
      id: number;
    }) => updateVendor(id, vendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: UpdateVendorSchemaType) {
    mutate({ id: id, vendor: data });
  }

  useEffect(() => {
    if (data?.data) {
      const baseUser = data?.data?.users
        ? data?.data?.users.find((user) => user?.isBaseOwner === 1)
        : null;

      form.reset({
        name: data?.data?.name ?? "",
        period: data?.data?.period ?? "",
        price: data?.data?.price ?? "",
        discount: data?.data?.discount ?? "",
        merchantLimit: data?.data?.merchantLimit ?? "",
        status: data?.data?.status,
        username: baseUser?.username ?? "",
        userRoles: baseUser?.roles
          ? baseUser?.roles.map((role) => role.roleId!)
          : [],
      });
    }
  }, [data?.data]);

  if (isLoading) return <LoadingCard />;

  if (isError) return <ErrorCard />;

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Update Vendor" icon={faEdit} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "40vw" }}
      breakpoints={{ "1281px": "70vw", "641px": "100vw" }}
    >
      <VendorForm
        id={data?.data?.id}
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
      />
    </Dialog>
  );
};

export default UpdateDialog;
