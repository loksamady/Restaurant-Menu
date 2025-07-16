import useUrlLang from "@src/hooks/useUrlLng";
import { Navigate } from "react-router-dom";

type Props = {
  to: string;
};

const NavigateComponent = ({ to }: Props) => {
  const lang = useUrlLang();

  return <Navigate to={`/${lang.lang}${to}`} replace />;
};

export default NavigateComponent;
