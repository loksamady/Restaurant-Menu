import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialogHeader from "../../components/ConfirmDialogHeader";
import {
  MerchantThemeSchemaType,
  merchantThemeSchema,
} from "@src/validationType/merchant";
import { MerchantThemeResponseType } from "@src/types/admin/merchant";
import { useMerchantStore } from "@src/state/merchant";
import {
  getMerchantTheme,
  updateMerchantTheme,
} from "@src/api/service/merchant.service";
import { useEffect } from "react";
import LoadingCard from "@src/components/LoadingCard";
import ErrorCard from "@src/components/ErrorCard";
import MerchantThemeForm from "./MerchantThemeForm";
import { Vibrant } from "node-vibrant/browser";
import { IMAGE_URL } from "@src/constant/env";

type Props = {
  merchantId: number;
  merchantLogo?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const UpdateThemeDialog = ({
  merchantId,
  merchantLogo,
  visible,
  setVisible,
}: Props) => {
  const { themeFormData, resetThemeFormData } = useMerchantStore();

  const { data, isLoading, isError } = useQuery<MerchantThemeResponseType>({
    queryKey: ["merchant-theme", merchantId],
    queryFn: () => getMerchantTheme(merchantId),
  });

  const form = useForm<MerchantThemeSchemaType>({
    resolver: zodResolver(merchantThemeSchema),
    defaultValues: themeFormData,
  });

  const handleReset = () => {
    form.reset(themeFormData);
    resetThemeFormData();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      merchantId,
      merchantTheme,
    }: {
      merchantId: number;
      merchantTheme: MerchantThemeSchemaType;
    }) => updateMerchantTheme(merchantId, merchantTheme),
    onSuccess: () => {
      handleReset();
      setVisible(false);
    },
  });

  function onSubmit(data: MerchantThemeSchemaType) {
    mutate({ merchantId: merchantId, merchantTheme: data });
  }

  const merchantLogoUrl = merchantLogo
    ? `${IMAGE_URL}/merchant_logos/${merchantLogo}`
    : null;

  const getThemeLogoColor = () => {
    return merchantLogoUrl
      ? Vibrant.from(merchantLogoUrl)
          .getPalette()
          .then((palette) => {
            return {
              primary: palette?.Vibrant?.hex
                ? palette?.Vibrant?.hex.replace("#", "")
                : "",
              primaryLight: palette?.LightVibrant?.hex
                ? palette?.LightVibrant?.hex.replace("#", "")
                : "",
              primaryDark: palette?.DarkVibrant?.hex
                ? palette?.DarkVibrant?.hex.replace("#", "")
                : "",
              secondary: palette?.Muted?.hex
                ? palette?.Muted?.hex.replace("#", "")
                : "",
              secondaryLight: palette?.LightMuted?.hex
                ? palette?.LightMuted?.hex.replace("#", "")
                : "",
              secondaryDark: palette?.DarkMuted?.hex
                ? palette?.DarkMuted?.hex.replace("#", "")
                : "",
            };
          })
      : {
          primary: "",
          primaryLight: "",
          primaryDark: "",
          secondary: "",
          secondaryLight: "",
          secondaryDark: "",
        };
  };

  async function resetTheme() {
    const maybePromise = getThemeLogoColor();
    const color =
      maybePromise instanceof Promise ? await maybePromise : maybePromise;

    form.reset({
      primary: color?.primary,
      primaryLight: color?.primaryLight,
      primaryDark: color?.primaryDark,
      secondary: color?.secondary,
      secondaryLight: color?.secondaryLight,
      secondaryDark: color?.secondaryDark,
    });
  }

  useEffect(() => {
    async function setData() {
      if (data?.data) {
        const maybePromise = getThemeLogoColor();
        const color =
          maybePromise instanceof Promise ? await maybePromise : maybePromise;

        form.reset({
          primary: data?.data?.primary || color?.primary,
          primaryLight: data?.data?.primaryLight || color?.primaryLight,
          primaryDark: data?.data?.primaryDark || color?.primaryDark,
          secondary: data?.data?.secondary || color?.secondary,
          secondaryLight: data?.data?.secondaryLight || color?.secondaryLight,
          secondaryDark: data?.data?.secondaryDark || color?.secondaryDark,
        });
      } else {
        handleReset();
      }
    }

    setData();
  }, [data?.data]);

  if (isLoading) return <LoadingCard />;

  if (isError) return <ErrorCard />;

  return (
    <Dialog
      header={
        <ConfirmDialogHeader title="Set Merchant Theme" icon={faPalette} />
      }
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        handleReset();
      }}
      style={{ width: "40vw" }}
      breakpoints={{ "1281px": "60vw", "960px": "80vw", "641px": "100vw" }}
    >
      <MerchantThemeForm
        form={form}
        handleSubmit={onSubmit}
        isLoading={isPending}
        merchantLogo={merchantLogo ?? ""}
        resetTheme={resetTheme}
      />
    </Dialog>
  );
};

export default UpdateThemeDialog;
