import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tag } from "primereact/tag";

type props = {
  title: string;
  icon?: IconProp;
  tagValue?: string;
  tagSeverity?: "success" | "info" | "warning" | "danger" | null | undefined;
};

function ConfirmDialogHeader({
  title,
  tagValue,
  icon,
  tagSeverity = "danger",
}: props) {
  return (
    <div className="flex items-center gap-2">
      {icon && <FontAwesomeIcon icon={icon} />}
      <span className="text-base md:text-lg lg:text-xl">{title}</span>
      {tagValue && <Tag value={tagValue} severity={tagSeverity} />}
    </div>
  );
}

export default ConfirmDialogHeader;
