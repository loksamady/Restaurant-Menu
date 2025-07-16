import { NavMenuType } from "@src/types/menu";
import { Handle, Position } from "@xyflow/react";
import { Divider } from "primereact/divider";
import { Link } from "react-router-dom";

type Props = {
  data: {
    url?: string;
    label: string;
    items: NavMenuType[];
    color: string;
    borderColor: string;
    setVisible: (visible: boolean) => void;
    isOutSourceUrl: boolean;
  };
};

function SiteMapNode({ data }: Props) {
  const renderHeader = () => {
    if (data.items)
      return <p className="text-sm font-semibold text-center">{data.label}</p>;
    if (data.isOutSourceUrl)
      return (
        <p
          onClick={() => {
            window.open(data.url!, "_blank");
          }}
          className="text-sm font-semibold text-center"
        >
          {data.label}
        </p>
      );
    else
      return (
        <Link
          onClick={() => {
            data.setVisible(false);
          }}
          to={data.url!}
        >
          <p className="text-sm font-semibold text-center">{data.label}</p>
        </Link>
      );
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col gap-3 items-center">
        <div
          className={`max-w-sm p-2 shadow-md min-w-[150px] text-xs ${data.color} text-white text-nowrap`}
        >
          {renderHeader()}
        </div>
        {data.items?.map((item) => {
          return (
            <div
              key={item.id! + item.url!}
              className={`max-w-sm p-2 shadow-md w-[180px] text-xs border-t-2 ${data.borderColor}`}
            >
              <p className="text-sm font-semibold text-center">{item.label}</p>
              <Divider className="my-2" />
              <div>
                <ul className="list-disc pl-5">
                  {item.items?.map((item: NavMenuType) => {
                    return (
                      <Link
                        target={item.isOutSourceUrl ? "_blank" : ""}
                        key={item.id}
                        onClick={() => {
                          data.setVisible(false);
                        }}
                        to={item.url!}
                      >
                        <li
                          className={`hover:text-${data.color} hover:font-bold transition-colors duration-300 text-sm`}
                        >
                          {item.label}
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default SiteMapNode;
