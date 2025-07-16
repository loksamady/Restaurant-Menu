import { Button } from "primereact/button";
import { UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import { MerchantSchemaType } from "@src/validationType/merchant";
import FormFileSelector from "@src/components/Form/FormFileSelector";
import { FileType } from "@src/types/file";
import FormTextarea from "@src/components/Form/FormTextArea";
import FormCheckbox from "@src/components/Form/FormCheckbox";
import FormInputPhoneNumber from "@src/components/Form/FormInputPhoneNumber";
import FormDropdown from "@src/components/Form/FormDropdown";
import { ImageSection } from "./ImageSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import { deleteMerchantFile } from "@src/api/service/merchant.service";
import { Divider } from "primereact/divider";

type Props = {
  id?: number;
  form: UseFormReturn<MerchantSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: MerchantSchemaType) => void;
  currentLogo?: FileType[];
  setCurrentLogo?: (currentLogo: FileType[]) => void;
  currentBanners?: FileType[];
  setCurrentBanners?: (currentLogo: FileType[]) => void;
};

const MerchantForm = ({
  id,
  form,
  isLoading,
  handleSubmit,
  currentLogo,
  setCurrentLogo,
  currentBanners,
  setCurrentBanners,
}: Props) => {
  const maximumLogoFile = currentLogo ? 1 - currentLogo.length : 1;
  const maximumBannerFile = currentBanners ? 5 - currentBanners.length : 5;

  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectFile, setSelectFile] = useState<FileType | null>(null);

  const generateTimeOptions = () => {
    const times: string[] = [];

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const period = h < 12 ? "AM" : "PM";
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour12}:${minute} ${period}`);
      }
    }

    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      {setCurrentBanners && currentBanners && selectFile?.id && (
        <ActionConfirmDialog
          id={selectFile!.id}
          dialogTitle="Confirm Delete Banner"
          dialogIcon={faTrash}
          dialogContent="Are you sure you want to delete this banner?"
          queryKey="merchants"
          mutationFn={deleteMerchantFile}
          visible={deleteVisible}
          setVisible={setDeleteVisible}
          successCallback={(id: number) => {
            setCurrentBanners(currentBanners.filter((file) => file.id !== id));
          }}
        />
      )}

      <div className="flex flex-col lg:flex-row lg:items-start gap-1 md:gap-2">
        <div className="lg:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
            <FormInput
              name="name"
              placeholder="Name"
              title="Name"
              control={form.control}
              required
            />
            <FormInputPhoneNumber
              name="primaryPhone"
              placeholder="855 XX XXX XXX"
              title="Primary Phone"
              control={form.control}
              required
            />
            <FormInput
              name="slug"
              placeholder="example-name"
              title="Slug"
              control={form.control}
            />
            <FormInputPhoneNumber
              name="secondaryPhone"
              placeholder="855 XX XXX XXX"
              title="Secondary Phone"
              control={form.control}
            />
            <FormDropdown
              name="openTime"
              title="Open Time"
              placeholder="Select a Time"
              filter
              options={timeOptions}
              control={form.control}
            />
            <FormDropdown
              name="closeTime"
              title="Close Time"
              placeholder="Select a Time"
              filter
              options={timeOptions}
              control={form.control}
            />
            <FormInput name="address" title="Address" control={form.control} />
            <FormInput
              name="location"
              remark="(URL)"
              placeholder="https://www.example.com"
              title="Location"
              control={form.control}
            />
          </div>

          <Divider align="left" className="md:col-span-2">
            <p className="px-2 bg-white font-semibold text-sm text-primary">
              Title and Subtitle for display on Website
            </p>
          </Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
            <FormInput
              name="titleEn"
              title="Title"
              remark="(English)"
              control={form.control}
            />
            <FormInput
              name="subtitleEn"
              title="Subtitle"
              remark="(English)"
              control={form.control}
            />
            <FormInput
              name="titleKh"
              title="Title"
              remark="(Khmer)"
              control={form.control}
            />
            <FormInput
              name="subtitleKh"
              title="Subtitle"
              remark="(Khmer)"
              control={form.control}
            />
            <FormInput
              name="titleCn"
              title="Title"
              remark="(Chinese)"
              control={form.control}
            />
            <FormInput
              name="subtitleCn"
              title="Subtitle"
              remark="(Chinese)"
              control={form.control}
            />
          </div>

          <Divider align="left" className="md:col-span-2">
            <p className="px-2 bg-white font-semibold text-sm text-primary">
              Social Media
            </p>
          </Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
            <FormInput
              name="telegram"
              remark="(URL)"
              placeholder="https://www.example.com"
              title="Telegram"
              control={form.control}
            />
            <FormInput
              name="facebook"
              remark="(URL)"
              placeholder="https://www.example.com"
              title="Facebook"
              control={form.control}
            />
            <FormInput
              name="instagram"
              remark="(URL)"
              placeholder="https://www.example.com"
              title="Instagram"
              control={form.control}
            />
            <FormInput
              name="tiktok"
              remark="(URL)"
              placeholder="https://www.example.com"
              title="Tik Tok"
              control={form.control}
            />
          </div>
        </div>

        <div className="flex flex-col lg:border-l lg:pl-4 lg:w-1/2">
          <Divider align="left" className="md:col-span-2">
            <p className="px-2 bg-white font-semibold text-sm text-primary">
              Logo - Maximum 1 and Resolution at least 400 x 400px (Aspect Ratio
              1:1)
            </p>
          </Divider>
          <div>
            <FormFileSelector
              form={form}
              fieldName={"logo"}
              imageOnly
              maximumFile={maximumLogoFile}
            />
            {currentLogo && (
              <ImageSection
                files={currentLogo}
                customButton={
                  <Button
                    type="button"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    severity="danger"
                    className="w-6 h-6 text-xs p-4"
                    size="small"
                    text
                    onClick={() => setCurrentLogo && setCurrentLogo([])}
                  />
                }
              />
            )}
          </div>

          <Divider align="left" className="md:col-span-2">
            <p className="px-2 bg-white font-semibold text-sm text-primary">
              Banners - Maximum 5 and Resolution at least 1600 x 400px (Aspect
              Ratio 4:1)
            </p>
          </Divider>
          <div>
            <FormFileSelector
              form={form}
              fieldName={"banners"}
              imageOnly
              maximumFile={maximumBannerFile}
            />
            {currentBanners && (
              <ImageSection
                files={currentBanners}
                onDelete={(file: FileType) => {
                  setDeleteVisible(true);
                  setSelectFile(file);
                }}
              />
            )}
          </div>

          <Divider align="left" className="md:col-span-2">
            <p className="px-2 bg-white font-semibold text-sm text-primary">
              Description on Banners for display on Website
            </p>
          </Divider>
          <TabView className="border rounded-md px-2 mb-4">
            <TabPanel header="English" className="py-2">
              <FormTextarea
                name="descriptionEn"
                control={form.control}
                placeholder="English Description"
              />
            </TabPanel>
            <TabPanel header="Khmer" className="py-2">
              <FormTextarea
                name="descriptionKh"
                control={form.control}
                placeholder="Khmer Description"
              />
            </TabPanel>
            <TabPanel header="Chinese" className="py-2">
              <FormTextarea
                name="descriptionCn"
                control={form.control}
                placeholder="Chinese Description"
              />
            </TabPanel>
          </TabView>

          <FormCheckbox
            name="active"
            title="Status"
            label="Active"
            control={form.control}
          />
        </div>
      </div>

      <div className="w-full">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label={id ? "Update" : "Create"}
          size="small"
          type="submit"
          className="h-10 w-full"
          onClick={() => form.handleSubmit(handleSubmit)}
        />
      </div>
    </form>
  );
};

export default MerchantForm;
