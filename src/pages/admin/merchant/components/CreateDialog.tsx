import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import MerchantForm from "./MerchantForm";
import { useMerchantStore } from "@src/state/merchant";
import {
  merchantSchema,
  MerchantSchemaType,
} from "@src/validationType/merchant";
import { createMerchant } from "@src/api/service/merchant.service";
import { Vibrant } from "node-vibrant/browser";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const CreateDialog = ({ visible, setVisible }: Props) => {
  const queryClient = useQueryClient();
  const { formData: defaultValues, resetFormData } = useMerchantStore();

  const form = useForm<MerchantSchemaType>({
    resolver: zodResolver(merchantSchema),
    defaultValues: defaultValues,
  });

  const handleReset = () => {
    form.reset(defaultValues);
    resetFormData();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-options"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-auth"] });
      handleReset();
      setVisible(false);
    },
  });

  async function onSubmit(data: MerchantSchemaType) {
    const formData: FormData = new FormData();

    // Add theme data
    if (data?.logo && data?.logo[0]) {
      await Vibrant.from(URL.createObjectURL(data?.logo[0]))
        .getPalette()
        .then((palette) => {
          palette?.Vibrant?.hex &&
            formData.append("primary", palette?.Vibrant?.hex.replace("#", ""));
          palette?.LightVibrant?.hex &&
            formData.append(
              "primaryLight",
              palette?.LightVibrant?.hex.replace("#", "")
            );
          palette?.DarkVibrant?.hex &&
            formData.append(
              "primaryDark",
              palette?.DarkVibrant?.hex.replace("#", "")
            );
          palette?.Muted?.hex &&
            formData.append("secondary", palette?.Muted?.hex.replace("#", ""));
          palette?.LightMuted?.hex &&
            formData.append(
              "secondaryLight",
              palette?.LightMuted?.hex.replace("#", "")
            );
          palette?.DarkMuted?.hex &&
            formData.append(
              "secondaryDark",
              palette?.DarkMuted?.hex.replace("#", "")
            );
        });
    }

    // Add merchant data
    data?.name && formData.append("name", data?.name);
    data?.primaryPhone && formData.append("primaryPhone", data?.primaryPhone);
    data?.secondaryPhone &&
      formData.append("secondaryPhone", data?.secondaryPhone);
    data?.titleEn && formData.append("titleEn", data?.titleEn);
    data?.titleKh && formData.append("titleKh", data?.titleKh);
    data?.titleCn && formData.append("titleCn", data?.titleCn);
    data?.subtitleEn && formData.append("subtitleEn", data?.subtitleEn);
    data?.subtitleKh && formData.append("subtitleKh", data?.subtitleKh);
    data?.subtitleCn && formData.append("subtitleCn", data?.subtitleCn);
    data?.descriptionEn &&
      formData.append("descriptionEn", data?.descriptionEn);
    data?.descriptionKh &&
      formData.append("descriptionKh", data?.descriptionKh);
    data?.descriptionCn &&
      formData.append("descriptionCn", data?.descriptionCn);
    data?.address && formData.append("address", data?.address);
    data?.location && formData.append("location", data?.location);
    data?.openTime && formData.append("openTime", data?.openTime);
    data?.closeTime && formData.append("closeTime", data?.closeTime);
    data?.slug && formData.append("slug", data?.slug);
    data?.telegram && formData.append("telegram", data?.telegram);
    data?.facebook && formData.append("facebook", data?.facebook);
    data?.instagram && formData.append("instagram", data?.instagram);
    data?.tiktok && formData.append("tiktok", data?.tiktok);
    data?.logo &&
      data?.logo.map((logo) => logo && formData.append("logo", logo));
    data?.banners &&
      data?.banners.map(
        (banner) => banner && formData.append("banners", banner)
      );
    formData.append("active", data?.active.toString());

    mutate(formData);
  }

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Create Merchant" icon={faAdd} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "60vw" }}
      breakpoints={{ "1281px": "80vw", "641px": "100vw" }}
    >
      <MerchantForm form={form} handleSubmit={onSubmit} isLoading={isPending} />
    </Dialog>
  );
};

export default CreateDialog;
