import { Handle, Position } from "@xyflow/react";

type Props = {
  data: {
    label: string;
  };
};

const handleStyle = { left: 10 };

const RootNode = ({ data }: Props) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="max-w-sm p-2 shadow-md min-w-[150px] text-xs bg-yellow-500 text-white text-nowrap">
        <p className="text-base font-semibold text-center">{data.label}</p>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
};

export default RootNode;
