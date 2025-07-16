import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { FormLabelType } from "@src/types/form";

type FormInputNumberProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  addOn?: string;
} & FormLabelType &
  Omit<InputNumberProps, "value" | "onChange">;

const FormInputNumber = <T extends FieldValues>({
  placeholder,
  name,
  control,
  addOn,
  ...props
}: FormInputNumberProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <div className="relative">
        <Label {...props} />
        <div className="p-inputgroup flex-1">
          {addOn && (
            <span
              className={`p-inputgroup-addon p-0 ${
                !!fieldState.error && "bg-red-600/10"
              } `}
            >
              $
            </span>
          )}
          <InputNumber
            value={field.value}
            onChange={(e) => {
              const newValue = e.value;
              const max = props.max;

              if (
                typeof max === "number" &&
                typeof newValue === "number" &&
                newValue > max
              ) {
                field.onChange(max); // Clamp to max
              } else {
                field.onChange(newValue);
              }
            }}
            className="p-inputtext-sm w-full"
            placeholder={placeholder}
            invalid={!!fieldState.error}
            {...props}
          />
          <ErrorMessage message={fieldState.error?.message} />
        </div>
      </div>
    )}
  />
);

export default FormInputNumber;
