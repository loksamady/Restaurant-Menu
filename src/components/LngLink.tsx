import useUrlLang from "@src/hooks/useUrlLng";
import { Link, LinkProps } from "react-router-dom";

interface LngLinkProps extends LinkProps {
  to: string;
}

const LngLink = ({ to, children, ...props }: LngLinkProps) => {
  const lang = useUrlLang();
  return (
    <Link to={`/${lang.lang}${to}`} {...props}>
      {children}
    </Link>
  );
};

export default LngLink;
