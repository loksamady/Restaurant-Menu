import useUrlLng from "@src/hooks/useUrlLng";

import { PageType, PageTypeResponse } from "@src/types/page";
import { useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import { getPageDetail } from "@src/api/service/pageService";
import LoadingComponent from "./LoadingComponent";
import ErrorCard from "./ErrorCard";

type Props = {
  page: PageType;
};

const DescriptionContent = ({ page }: Props) => {
  const lang = useUrlLng();

  const { data, isLoading, isError } = useQuery<PageTypeResponse>({
    queryKey: ["pages", page.id],
    queryFn: () => getPageDetail(parseInt(page.id.toString())),
  });

  if (isLoading) return <LoadingComponent />;

  if (isError) return <ErrorCard />;

  return (
    <div className="jodit-editor mb-10">
      {parse(
        (lang?.lang === "kh"
          ? data?.data.descriptionKh
          : data?.data.descriptionEn) || ""
      )}
    </div>
  );
};

export default DescriptionContent;
