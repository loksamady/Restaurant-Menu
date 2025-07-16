import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Password, PasswordProps } from "primereact/password";
import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { FormLabelType } from "@src/types/form";
import { Divider } from "primereact/divider";

type FormPasswordProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
} & FormLabelType &
  PasswordProps;

const FormPassword = <T extends FieldValues>({
  placeholder,
  name,
  control,
  ...props
}: FormPasswordProps<T>) => {
  const passwordFooterTemplate = (
    <div>
      <Divider />
      <p className="mb-1 text-red-500 font-medium text-sm">Requirements</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Must be between 8 and 20 characters</li>
        <li>At least one numeric</li>
        <li>At least one uppercase</li>
        <li>At least one lowercase</li>
        <li>At least one special character</li>
      </ul>
    </div>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="relative w-full">
          <Label {...props} />
          <Password
            {...field}
            placeholder={placeholder}
            className="w-full"
            inputClassName="w-full p-inputtext-sm"
            toggleMask
            disabled={props.disabled}
            inputRef={field.ref}
            onChange={(e) => field.onChange(e.target.value)}
            footer={passwordFooterTemplate}
            invalid={!!fieldState.error}
            {...props}
          />
          <ErrorMessage message={fieldState.error?.message} />
        </div>
      )}
    />
  );
};

export default FormPassword;
