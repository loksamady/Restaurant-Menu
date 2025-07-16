import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  MerchantSchemaType,
  merchantSchema,
} from "@src/validationType/merchant";
import MerchantForm from "./MerchantForm";
import { MerchantDetailResponseType } from "@src/types/admin/merchant";
import { useMerchantStore } from "@src/state/merchant";
import { getMerchant, updateMerchant } from "@src/api/service/merchant.service";
import { useEffect, useState } from "react";
import LoadingCard from "@src/components/LoadingCard";
import ErrorCard from "@src/components/ErrorCard";
import { FileType } from "@src/types/file";
import { Vibrant } from "node-vibrant/browser";

type Props = {
  id: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const UpdateDialog = ({ id, visible, setVisible }: Props) => {
  const queryClient = useQueryClient();
  const { formData, resetThemeFormData, resetFormData } = useMerchantStore();

  const [currentLogo, setCurrentLogo] = useState<FileType[]>([]);
  const [currentBanners, setCurrentBanners] = useState<FileType[]>([]);

  const { data, isLoading, isError } = useQuery<MerchantDetailResponseType>({
    queryKey: ["merchant", id],
    queryFn: () => getMerchant(id),
  });

  const form = useForm<MerchantSchemaType>({
    resolver: zodResolver(merchantSchema),
    defaultValues: formData,
  });

  const handleReset = () => {
    form.reset(formData);
    resetFormData();
    resetThemeFormData();
    setCurrentLogo([]);
    setCurrentBanners([]);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ merchant, id }: { merchant: FormData; id: number }) =>
      updateMerchant(id, merchant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-options"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-auth"] });
      handleReset();
      setVisible(false);
    },
  });

  async function onSubmit(merchant: MerchantSchemaType) {
    const formData: FormData = new FormData();

    // Add theme data
    if (merchant?.logo && merchant?.logo[0]) {
      await Vibrant.from(URL.createObjectURL(merchant?.logo[0]))
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
    merchant?.name && formData.append("name", merchant?.name);
    merchant?.primaryPhone &&
      formData.append("primaryPhone", merchant?.primaryPhone);
    merchant?.secondaryPhone &&
      formData.append("secondaryPhone", merchant?.secondaryPhone);
    merchant?.titleEn && formData.append("titleEn", merchant?.titleEn);
    merchant?.titleKh && formData.append("titleKh", merchant?.titleKh);
    merchant?.titleCn && formData.append("titleCn", merchant?.titleCn);
    merchant?.subtitleEn && formData.append("subtitleEn", merchant?.subtitleEn);
    merchant?.subtitleKh && formData.append("subtitleKh", merchant?.subtitleKh);
    merchant?.subtitleCn && formData.append("subtitleCn", merchant?.subtitleCn);
    merchant?.descriptionEn &&
      formData.append("descriptionEn", merchant?.descriptionEn);
    merchant?.descriptionKh &&
      formData.append("descriptionKh", merchant?.descriptionKh);
    merchant?.descriptionCn &&
      formData.append("descriptionCn", merchant?.descriptionCn);
    merchant?.address && formData.append("address", merchant?.address);
    merchant?.location && formData.append("location", merchant?.location);
    merchant?.openTime && formData.append("openTime", merchant?.openTime);
    merchant?.closeTime && formData.append("closeTime", merchant?.closeTime);
    merchant?.slug && formData.append("slug", merchant?.slug);
    merchant?.telegram && formData.append("telegram", merchant?.telegram);
    merchant?.facebook && formData.append("facebook", merchant?.facebook);
    merchant?.instagram && formData.append("instagram", merchant?.instagram);
    merchant?.tiktok && formData.append("tiktok", merchant?.tiktok);
    merchant?.logo &&
      merchant?.logo.map((logo) => formData.append("logo", logo));
    merchant?.banners &&
      merchant?.banners.map(
        (banner) => banner && formData.append("banners", banner)
      );
    formData.append("active", merchant?.active.toString());
    const isLogoDeleted =
      !!data?.data?.logo && currentLogo.length <= 0 && !merchant?.logo;
    formData.append("isLogoDeleted", isLogoDeleted.toString());

    mutate({ id: id, merchant: formData });
  }

  useEffect(() => {
    if (data?.data) {
      form.reset({
        name: data?.data?.name ?? "",
        primaryPhone: data?.data?.primaryPhone ?? "",
        secondaryPhone: data?.data?.secondaryPhone ?? "",
        titleEn: data?.data?.titleEn ?? "",
        titleKh: data?.data?.titleKh ?? "",
        titleCn: data?.data?.titleCn ?? "",
        subtitleEn: data?.data?.subtitleEn ?? "",
        subtitleKh: data?.data?.subtitleKh ?? "",
        subtitleCn: data?.data?.subtitleCn ?? "",
        descriptionEn: data?.data?.descriptionEn ?? "",
        descriptionKh: data?.data?.descriptionKh ?? "",
        descriptionCn: data?.data?.descriptionCn ?? "",
        address: data?.data?.address ?? "",
        location: data?.data?.location ?? "",
        openTime: data?.data?.openTime ?? "",
        closeTime: data?.data?.closeTime ?? "",
        slug: data?.data?.slug ?? "",
        telegram: data?.data?.telegram ?? "",
        facebook: data?.data?.facebook ?? "",
        instagram: data?.data?.instagram ?? "",
        tiktok: data?.data?.tiktok ?? "",
        active: data?.data?.active,
      });

      setCurrentBanners(data?.data?.banners ?? []);
      if (data?.data?.logo) {
        const logoFile: FileType = {
          id: data?.data.id,
          fileName: data?.data?.logo,
          main: true,
        };
        setCurrentLogo([logoFile]);
      } else {
        setCurrentLogo([]);
      }
    }
  }, [data?.data]);

  if (isLoading) return <LoadingCard />;

  if (isError) return <ErrorCard />;

  return (
    <Dialog
      header={<ConfirmDialogHeader title="Update Merchant" icon={faEdit} />}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "60vw" }}
      breakpoints={{ "1281px": "80vw", "641px": "100vw" }}
    >
      <MerchantForm
        id={data?.data?.id}
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
        currentLogo={currentLogo}
        setCurrentLogo={setCurrentLogo}
        currentBanners={currentBanners}
        setCurrentBanners={setCurrentBanners}
      />
    </Dialog>
  );
};

export default UpdateDialog;
