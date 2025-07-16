import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tag } from "primereact/tag";

type props = {
  title: string;
  remark?: string;
  active?: boolean;
  tagValue?: string;
  tagSeverity?: "info" | "warning" | "danger" | "success" | null | undefined;
  icon?: IconProp;
  actionContent?: JSX.Element;
};

function PageHeader({
  title,
  remark,
  active = true,
  tagValue,
  tagSeverity = "danger",
  icon,
  actionContent,
}: props) {
  return (
    <div className="flex justify-between items-center mb-4 text-gray-700">
      <div className="flex flex-row items-center">
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="text-lg lg:text-xl xl:text-2xl pr-2 hidden md:block"
          />
        )}
        <p className="flex items-center gap-2 text-lg lg:text-xl xl:text-2xl font-bold">
          {title}
          {remark && (
            <span className={!active ? "text-red-500" : "text-gray-500"}>
              {remark}
            </span>
          )}
          {tagValue && <Tag value={tagValue} severity={tagSeverity} />}
        </p>
      </div>
      <div className="flex gap-2">{actionContent}</div>
    </div>
  );
}

export default PageHeader;
