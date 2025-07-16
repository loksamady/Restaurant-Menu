import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";
import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { FormLabelType } from "@src/types/form";

type FormTextareaProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
} & FormLabelType &
  InputTextareaProps;

const FormTextarea = <T extends FieldValues>({
  placeholder,
  name,
  control,
  ...props
}: FormTextareaProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <div className="relative">
        <Label {...props} />
        <InputTextarea
          rows={5}
          className="p-inputtextarea-sm w-full"
          placeholder={placeholder}
          {...field}
          autoResize
          invalid={!!fieldState.error}
        />
        <ErrorMessage message={fieldState.error?.message} />
      </div>
    )}
  />
);

export default FormTextarea;
