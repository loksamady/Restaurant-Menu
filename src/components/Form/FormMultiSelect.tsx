import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { FormLabelType } from "@src/types/form";
import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type FormMultiSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
} & FormLabelType &
  MultiSelectProps;

const FormMultiSelect = <T extends FieldValues>({
  name,
  control,
  ...props
}: FormMultiSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="relative">
          <Label {...props} />
          <MultiSelect
            value={field.value}
            className="w-full text-sm"
            onChange={field.onChange}
            {...props}
          />
          <ErrorMessage message={fieldState.error?.message} />
        </div>
      )}
    />
  );
};

export default FormMultiSelect;
