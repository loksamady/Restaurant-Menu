import { Button } from "primereact/button";
import { UseFormReturn } from "react-hook-form";
import { MerchantThemeSchemaType } from "@src/validationType/merchant";
import FormColorPickerInput from "@src/components/Form/FormColorPickerInput";
import { Divider } from "primereact/divider";
import { IMAGE_URL } from "@src/constant/env";

type Props = {
  form: UseFormReturn<MerchantThemeSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: MerchantThemeSchemaType) => void;
  resetTheme: () => void;
  merchantLogo?: string;
};

const MerchantThemeForm = ({
  form,
  isLoading,
  handleSubmit,
  resetTheme,
  merchantLogo,
}: Props) => {
  const merchantLogoUrl = merchantLogo
    ? `${IMAGE_URL}/merchant_logos/${merchantLogo}`
    : null;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      {merchantLogoUrl && (
        <div className="flex justify-center">
          <img src={merchantLogoUrl} alt="merchant-logo" className="h-44" />
        </div>
      )}
      <div>
        <Divider className="my-2" align="left">
          <p className="px-2 bg-white font-semibold text-sm text-primary">
            Primary Color Selection
          </p>
        </Divider>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormColorPickerInput
            control={form.control}
            name="primary"
            title="Normal"
          />
          <FormColorPickerInput
            control={form.control}
            name="primaryLight"
            title="Light"
          />
          <FormColorPickerInput
            control={form.control}
            name="primaryDark"
            title="Dark"
          />
        </div>

        <Divider className="my-2" align="left">
          <p className="px-2 bg-white font-semibold text-sm text-primary">
            Secondary Color Selection
          </p>
        </Divider>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormColorPickerInput
            control={form.control}
            name="secondary"
            title="Normal"
          />
          <FormColorPickerInput
            control={form.control}
            name="secondaryLight"
            title="Light"
          />
          <FormColorPickerInput
            control={form.control}
            name="secondaryDark"
            title="Dark"
          />
        </div>
      </div>

      <div className="w-full flex gap-2 justify-end">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label="Reset"
          size="small"
          type="button"
          className="h-10"
          text
          severity="secondary"
          onClick={resetTheme}
        />
        <Button
          disabled={isLoading}
          loading={isLoading}
          label="Save"
          size="small"
          type="submit"
          className="h-10"
          onClick={() => form.handleSubmit(handleSubmit)}
        />
      </div>
    </form>
  );
};

export default MerchantThemeForm;
