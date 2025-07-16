import { FormLabelType } from "@src/types/form";

function Label({ title, remark, required }: FormLabelType) {
  return (
    <label className="block text-gray-800 text-sm font-medium mb-1">
      {title}
      {remark && <span className="text-gray-500 text-sm pl-1">{remark}</span>}
      {required && <span className="text-red-500 text-sm pl-1">*</span>}
    </label>
  );
}

export default Label;
