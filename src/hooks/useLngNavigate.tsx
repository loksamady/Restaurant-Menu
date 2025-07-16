import useUrlLang from "@src/hooks/useUrlLng";
import { useNavigate } from "react-router-dom";

const useLngNavigate = () => {
  const lang = useUrlLang();
  const navigate = useNavigate();

  const customNavigate = (path: string) => {
    navigate(`/${lang.lang}${path}`);
  };

  return customNavigate;
};

export default useLngNavigate;
