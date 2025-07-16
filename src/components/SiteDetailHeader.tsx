type Props = {
  title: string;
};

const SiteDetailHeader = ({ title }: Props) => {
  return (
    <div className="align-items-center w-full rounded-sm my-3 px-4">
      <div className="flex items-center justify-between flex-wrap">
        <p className="xl:mx-0 xl:text-2xl font-bold text-gray-800 pb-1">
          {title}
        </p>
      </div>
      <div className="h-1 bg-csx-color-3 mb-2 mt-1"></div>
    </div>
  );
};

export default SiteDetailHeader;
