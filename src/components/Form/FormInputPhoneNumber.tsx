import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { FormLabelType } from "@src/types/form";
import { phoneNumberRegex } from "@src/util/regexUtil";
import { InputNumberProps } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
} from "react-hook-form";

type FormInputNumberProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  disabled?: string;
  readOnly?: string;
} & FormLabelType &
  Omit<InputNumberProps, "value" | "onChange">;

const FormInputPhoneNumber = <T extends FieldValues>({
  placeholder,
  name,
  control,
  disabled,
  readOnly,
  ...props
}: FormInputNumberProps<T>) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<T, Path<T> & (string | undefined)>
  ) => {
    const inputValue = event?.target?.value;

    if (phoneNumberRegex.test(inputValue) || inputValue === "") {
      field.onChange(inputValue);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="relative">
          <Label {...props} />
          <InputText
            value={field?.value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className="p-inputtext-sm w-full"
            invalid={!!fieldState.error}
            onChange={(e) => handleChange(e, field)}
          />
          <ErrorMessage message={fieldState.error?.message} />
        </div>
      )}
    />
  );
};

export default FormInputPhoneNumber;
