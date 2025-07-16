import {
  faFacebook,
  faInstagram,
  faTelegram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWebsiteStore } from "@src/state/website";
import { Link } from "react-router-dom";

type Props = {
  isFooter?: boolean;
};

const SocialMedia = ({ isFooter = false }: Props) => {
  const { merchant } = useWebsiteStore();

  return (
    <div
      className={`flex items-center gap-3 ${
        isFooter && "text-3xl justify-center"
      }`}
    >
      {merchant?.facebook && (
        <Link to={merchant?.facebook || ""} target="_blank">
          <FontAwesomeIcon
            icon={faFacebook}
            className={`text-blue-600 cursor-pointer hover:scale-110 transition-transform ${
              isFooter ? "w-20 h-20" : "w-5 h-5"
            }`}
          />
        </Link>
      )}
      {merchant?.instagram && (
        <Link to={merchant?.instagram || ""} target="_blank">
          <FontAwesomeIcon
            icon={faInstagram}
            className={`text-pink-600 cursor-pointer hover:scale-110 transition-transform ${
              isFooter ? "w-20 h-20" : "w-5 h-5"
            }`}
          />
        </Link>
      )}
      {merchant?.tiktok && (
        <Link to={merchant?.tiktok || ""} target="_blank">
          <FontAwesomeIcon
            icon={faTiktok}
            className={`text-black cursor-pointer hover:scale-110 transition-transform ${
              isFooter ? "w-20 h-20" : "w-5 h-5"
            }`}
          />
        </Link>
      )}
      {merchant?.telegram && (
        <Link to={merchant?.telegram || ""} target="_blank">
          <FontAwesomeIcon
            icon={faTelegram}
            className={`text-blue-500 cursor-pointer hover:scale-110 transition-transform ${
              isFooter ? "w-20 h-20" : "w-5 h-5"
            }`}
          />
        </Link>
      )}
    </div>
  );
};

export default SocialMedia;
