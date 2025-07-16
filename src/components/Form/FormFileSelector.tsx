/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorMessage from "@src/components/Form/ErrorMessage";
import Label from "@src/components/Form/Label";
import { Controller, UseFormReturn } from "react-hook-form";
import FileSelector from "./FileSelector";

type Props = {
  form: UseFormReturn<any>;
  fieldName: string;
  label?: string;
  remark?: string;
  required?: boolean;
  isFileRequired?: boolean;
  maximumFile: number;
  imageOnly?: boolean;
  videoOnly?: boolean;
};

const FormFileSelector = ({
  form,
  fieldName,
  label,
  remark,
  required,
  isFileRequired,
  maximumFile,
  imageOnly = false,
  videoOnly = false,
}: Props) => {
  return (
    maximumFile > 0 && (
      <Controller
        name={fieldName}
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex-1 text-sm">
            <Label title={label} required={required} remark={remark} />
            <FileSelector
              value={field.value}
              maxFiles={maximumFile}
              imageOnly={imageOnly}
              videoOnly={videoOnly}
              onChange={field.onChange}
            />
            <ErrorMessage
              message={
                isFileRequired ? "Files is required" : fieldState.error?.message
              }
            />
          </div>
        )}
      />
    )
  );
};

export default FormFileSelector;
