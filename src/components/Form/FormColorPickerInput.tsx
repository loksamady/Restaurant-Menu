import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { InputText, InputTextProps } from "primereact/inputtext";
import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { FormLabelType } from "@src/types/form";
import { ColorPicker } from "primereact/colorpicker";

type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
} & FormLabelType &
  InputTextProps;

const FormColorPickerInput = <T extends FieldValues>({
  placeholder,
  name,
  control,
  ...props
}: FormInputProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <div className="relative">
        <Label {...props} />
        <div className="flex flex-row gap-2 items-center">
          <ColorPicker {...field} />
          <InputText
            type="text"
            size="small"
            className="p-inputtext-sm w-full"
            placeholder={placeholder}
            {...field}
            disabled={props.disabled}
            invalid={!!fieldState.error}
          />
        </div>
        <ErrorMessage message={fieldState.error?.message} />
      </div>
    )}
  />
);

export default FormColorPickerInput;
