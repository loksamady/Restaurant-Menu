import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownProps,
} from "primereact/dropdown";
import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { FormLabelType } from "@src/types/form";

type FormDropdownProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
} & FormLabelType &
  DropdownProps;

const FormDropdown = <T extends FieldValues>({
  name,
  control,
  ...props
}: FormDropdownProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <div className="relative">
        <Label {...props} />
        <Dropdown
          value={field.value}
          onChange={(e: DropdownChangeEvent) => {
            const normalizedValue = e.value ?? null;
            field.onChange(normalizedValue);
          }}
          className="w-full text-xs"
          invalid={!!fieldState.error}
          {...props}
        />
        <ErrorMessage message={fieldState.error?.message} />
      </div>
    )}
  />
);

export default FormDropdown;
