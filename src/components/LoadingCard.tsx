import { Loader } from "lucide-react";

const LoadingCard = () => {
  return (
    <div className="border-l-4 border-l-gray-500 bg-white text-gray-500 p-4 lg:p-6 shadow-sm rounded-md text-lg font-semibold flex items-center gap-3">
      <Loader strokeWidth={2.5} className="pi-spin" />
      <span>Loading...</span>
    </div>
  );
};

export default LoadingCard;
