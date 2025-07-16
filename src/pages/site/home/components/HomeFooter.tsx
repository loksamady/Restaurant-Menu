import { CHINESE, KHMER } from "@src/constant/site/constant";
import useUrlLng from "@src/hooks/useUrlLng";
import { useWebsiteStore } from "@src/state/website";
import {
  displayPhoneNumber,
  formatPhoneToTelLink,
} from "@src/util/phoneNumberUtil";
import { Avatar } from "primereact/avatar";
import { Link } from "react-router-dom";
import SocialMedia from "./SocialMedia";
import { Clock, MapPin, Phone } from "lucide-react";
import { IMAGE_URL } from "@src/constant/env";

const HomeFooter = () => {
  const { lang } = useUrlLng();
  const { merchant } = useWebsiteStore();

  const subtitle =
    lang === CHINESE
      ? merchant?.subtitleCn
      : lang === KHMER
      ? merchant?.subtitleKh
      : merchant?.subtitleEn;

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-screen-xl container mx-auto px-4 text-center">
        <div className="flex justify-center items-center space-x-4 mb-4">
          <Avatar
            label={merchant?.name?.charAt(0)}
            image={
              merchant?.logo
                ? `${IMAGE_URL}/merchant_logos/${merchant?.logo}`
                : undefined
            }
            size="xlarge"
            shape="circle"
            className="bg-white w-10 h-10 font-bold text-white text-2xl shadow-sm"
          />
          <span className="text-xl font-bold">{merchant?.name}</span>
        </div>

        <p className="text-gray-400 mb-4">{subtitle}</p>

        <div className="block lg:hidden justify-center my-10">
          <SocialMedia isFooter />
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-6">
          {merchant?.address && (
            <span>
              <MapPin className="inline mr-2 h-5 w-5 animate-bounce" />{" "}
              <Link
                to={merchant?.location || "#"}
                target={merchant?.location && "_blank"}
                className="hover:text-blue-400 hover:underline transform duration-300"
              >
                {merchant?.address}
              </Link>
            </span>
          )}
          {merchant?.primaryPhone && (
            <span className="group">
              <Phone className="inline mr-2 h-5 w-5 group-hover:animate-wiggle" />{" "}
              <Link
                to={formatPhoneToTelLink(merchant?.primaryPhone)}
                className="hover:text-blue-400 hover:underline transform duration-300"
              >
                {displayPhoneNumber(merchant?.primaryPhone)}
              </Link>
              {merchant?.secondaryPhone && (
                <span>
                  {" "}
                  |{" "}
                  <Link
                    to={formatPhoneToTelLink(merchant?.secondaryPhone)}
                    className="hover:text-blue-400 hover:underline transform duration-300"
                  >
                    {displayPhoneNumber(merchant?.secondaryPhone)}
                  </Link>
                </span>
              )}
            </span>
          )}
          <span>
            <Clock className="inline mr-2 h-5 w-5" />
            Open {merchant?.openTime} - {merchant?.closeTime}
          </span>
        </div>

        <div className="flex flex-row justify-end items-start gap-1 mt-5 pt-5 border-t border-t-gray-500 text-sm">
          <span className="text-gray-300">Powered by</span>
          <Link
            to="https://dev-sphere.net/en"
            target="_blank"
            className="group hover:text-blue-400 transform duration-300 flex flex-col items-start gap-x-1 text-start"
          >
            <span className="font-bold">DevSphere</span>
            <span className="text-gray-400 text-xs ml-5 group-hover:translate-x-1 transform duration-300">
              Digital Menu/Catalog
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
