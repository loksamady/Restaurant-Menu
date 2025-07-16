import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import Label from "./Label";
import { Checkbox } from "primereact/checkbox";
import { FormLabelType } from "@src/types/form";
import { InputNumberProps } from "primereact/inputnumber";

type FormInputNumberProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
} & FormLabelType &
  Omit<InputNumberProps, "value" | "onChange">;

const FormCheckbox = <T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormInputNumberProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex-1">
          <Label {...props} />
          <div className="flex items-center gap-2">
            <Checkbox
              inputId={name}
              checked={field.value}
              onChange={(e) => field.onChange(e.checked)}
            />
            {label && <label>{label}</label>}
          </div>
        </div>
      )}
    />
  );
};

export default FormCheckbox;
