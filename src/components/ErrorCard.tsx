import { CircleX } from "lucide-react";

type Props = {
  message?: string;
};

const ErrorCard = ({ message }: Props) => {
  return (
    <div className="border-l-4 border-l-red-500 bg-red-100 text-red-500 p-4 lg:p-6 shadow-sm rounded-md text-lg flex items-center gap-3">
      <CircleX strokeWidth={2.5} />
      <div>
        <span className="font-semibold">Error</span>
        {message && <span>: {message}</span>}
      </div>
    </div>
  );
};

export default ErrorCard;
