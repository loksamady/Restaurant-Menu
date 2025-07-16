import Label from "@src/components/Form/Label";
import { Button } from "primereact/button";
import { Controller, UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import { CreateCategorySchemaType } from "@src/validationType/category";
import FormInputNumber from "@src/components/Form/FormInputNumber";
import { Checkbox } from "primereact/checkbox";

type Props = {
  form: UseFormReturn<CreateCategorySchemaType>;
  isLoading: boolean;
  handleSubmit: (data: CreateCategorySchemaType) => void;
  id?: number;
};

const CategoryForm = ({ form, isLoading, handleSubmit, id }: Props) => {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <FormInput
          name="nameEn"
          placeholder="English Name"
          title="English Name"
          control={form.control}
          required
        />
        <FormInput
          name="nameKh"
          placeholder="Khmer Name"
          title="Khmer Name"
          control={form.control}
          required
        />
        <FormInput
          name="nameCn"
          placeholder="Chinese Name"
          title="Chinese Name"
          control={form.control}
          required
        />
        <FormInputNumber
          name="displayOrder"
          placeholder="Display Order"
          title="Display Order"
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

export default CategoryForm;
