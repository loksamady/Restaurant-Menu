import Label from "@src/components/Form/Label";
import { Button } from "primereact/button";
import { Controller, UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import { CreateMenuSchemaType } from "@src/validationType/menu";
import FormTextarea from "@src/components/Form/FormTextArea";
import FormInputNumber from "@src/components/Form/FormInputNumber";
import FormFileSelector from "@src/components/Form/FormFileSelector";
import { ImageSection } from "./ImageSection";
import { MenuFileType, MenuType } from "@src/types/menu";
import { useEffect, useState } from "react";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteMenuFile } from "@src/api/service/menu.service";
import { Checkbox } from "primereact/checkbox";
import { TabPanel, TabView } from "primereact/tabview";
import FormCheckbox from "@src/components/Form/FormCheckbox";
import FormMultiSelect from "@src/components/Form/FormMultiSelect";
import { useCategoryStore } from "@src/state/category";
import { Message } from "primereact/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateDialog from "../../category/components/CreateDialog";

type Props = {
  form: UseFormReturn<CreateMenuSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: CreateMenuSchemaType) => void;
  menu?: MenuType;
  merchantId?: number | null;
};

const MenuForm = ({
  form,
  isLoading,
  handleSubmit,
  menu,
  merchantId,
}: Props) => {
  const { options: categoryOptions } = useCategoryStore();

  const getCategoryOptionByMerchantId = merchantId
    ? categoryOptions.filter((category) => category.merchantId === merchantId)
    : categoryOptions;

  const [createCategoryVisible, setCreateCategoryVisible] =
    useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectFile, setSelectFile] = useState<MenuFileType | null>(null);
  const [files, setFiles] = useState<MenuFileType[]>([]);

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    setFiles(menu?.files ?? []);
  }, []);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      {selectFile?.menuFileId && (
        <ActionConfirmDialog
          id={selectFile!.menuFileId}
          dialogTitle="Confirm Delete Image"
          dialogIcon={faTrash}
          dialogContent="Are you sure you want to delete this Menu?"
          queryKey="menus"
          mutationFn={deleteMenuFile}
          visible={deleteVisible}
          setVisible={setDeleteVisible}
          successCallback={(id) => {
            setFiles(files.filter((file) => file.menuFileId !== id));
          }}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <FormInput
          name="nameEn"
          title="English Name"
          placeholder="English Name"
          control={form.control}
          required
        />
        <FormInput
          name="nameKh"
          title="Khmer Name"
          placeholder="Khmer Name"
          control={form.control}
          required
        />
        <FormInput
          name="nameCn"
          title="Chinese Name"
          placeholder="Chinese Name"
          control={form.control}
          required
        />
        <FormInput
          name="code"
          placeholder="Code"
          title="Code"
          control={form.control}
        />
        <FormInputNumber
          mode="currency"
          currency="USD"
          name="price"
          remark="(USD)"
          title="Price"
          control={form.control}
        />
        <FormInputNumber
          mode="currency"
          currency="KHR"
          name="priceKh"
          title="Price"
          remark="(KHR)"
          control={form.control}
        />
        <FormInputNumber
          min={0}
          max={100}
          name="discount"
          placeholder="Discount"
          title="Discount"
          control={form.control}
        />
        <div className="flex gap-4">
          <FormCheckbox
            name="hot"
            title="Hot Menu"
            label="Enable"
            control={form.control}
          />

          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <div className="flex-1">
                <Label title="Status" />
                <div className="flex items-center gap-2">
                  <Checkbox
                    inputId="status"
                    checked={field.value === 1}
                    onChange={(e) => field.onChange(e.checked ? 1 : 0)}
                  />
                  <label htmlFor="status">Active</label>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormMultiSelect
          name="categories"
          control={form.control}
          value={form.watch("categories")}
          options={getCategoryOptionByMerchantId || []}
          optionValue="categoryId"
          optionLabel="nameEn"
          title="Categories"
          filter
          showClear
          placeholder="Select Categories"
          onChange={(e) => form.setValue("categories", e.target.value)}
        />
        <div className="flex flex-col-reverse md:flex-row items-center gap-2">
          <Message
            text="Warning: Please select/create a category, only menu with category will be shown on website!"
            severity="warn"
            className="w-full flex justify-start shadow-sm"
          />
          <Button
            type="button"
            label={isTouchDevice ? "New Category" : undefined}
            icon={<FontAwesomeIcon icon={faAdd} />}
            className="w-full md:w-auto"
            size="small"
            severity="secondary"
            tooltip={!isTouchDevice ? "New Category" : undefined}
            tooltipOptions={{ position: "bottom" }}
            onClick={() => setCreateCategoryVisible(!createCategoryVisible)}
          />
          <CreateDialog
            merchantId={merchantId}
            visible={createCategoryVisible}
            setVisible={setCreateCategoryVisible}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormFileSelector
          form={form}
          fieldName={"files"}
          label="Attach Files"
          imageOnly
          maximumFile={6}
        />
        {files != null && (
          <ImageSection
            mainId={form.watch("setMainFileId")}
            files={files}
            onDelete={(file: MenuFileType) => {
              setDeleteVisible(true);
              setSelectFile(file);
            }}
            onMainChange={(mainId: number) => {
              form.setValue("setMainFileId", mainId);
            }}
          />
        )}
      </div>

      <TabView className="border rounded-md px-2 mb-4">
        <TabPanel header="English">
          <FormTextarea
            name="descriptionEn"
            control={form.control}
            placeholder="English Description"
          />
        </TabPanel>
        <TabPanel header="Khmer">
          <FormTextarea
            name="descriptionKh"
            control={form.control}
            placeholder="Khmer Description"
          />
        </TabPanel>
        <TabPanel header="Chinese">
          <FormTextarea
            name="descriptionCn"
            control={form.control}
            placeholder="Chinese Description"
          />
        </TabPanel>
      </TabView>

      <div className="w-full">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label={menu ? "Update" : "Create"}
          size="small"
          type="submit"
          className="h-10 w-full"
          onClick={() => form.handleSubmit(handleSubmit)}
        />
      </div>
    </form>
  );
};

export default MenuForm;
