import { CircleAlert } from "lucide-react";

type Props = {
  message: string;
};

const MessageInfoCard = ({ message }: Props) => {
  return (
    <div className="border-l-4 border-l-blue-500 bg-blue-100 text-blue-500 p-4 lg:p-6 shadow-sm rounded-md text-lg flex items-center gap-3">
      <CircleAlert strokeWidth={2.5} />
      <div>
        <span className="font-semibold">Info</span>
        {message && <span>: {message}</span>}
      </div>
    </div>
  );
};

export default MessageInfoCard;
