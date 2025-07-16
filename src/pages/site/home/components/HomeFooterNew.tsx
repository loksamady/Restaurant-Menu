import {
  displayPhoneNumber,
  formatPhoneToTelLink,
} from "@src/util/phoneNumberUtil";
import { Link } from "react-router-dom";
import DevSphereLogo from "@src/assets/Logo/logo-white.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

const HomeFooter = () => {
  return (
    <footer className="relative py-10 md:py-14 text-white">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-950 to-black opacity-100" />

      <div className="relative max-w-screen-lg mx-auto px-4 md:px-10 z-20">
        <div className="flex flex-col md:flex-row gap-10 justify-center md:justify-between">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex justify-center md:justify-normal items-center">
              <img
                src={DevSphereLogo}
                alt="dev-sphere-logo"
                className="pb-5 h-32"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-normal items-center gap-4">
              {/* <FontAwesomeIcon
                icon={faGlobe}
                className="text-2xl md:text-lg xl:text-xl w-5"
              /> */}
              <Globe className="h-6" />
              <Link
                to="www.devsphere.com.kh"
                className="text-center md:text-left hover:text-primary translate duration-300"
                target="_blank"
              >
                www.devsphere.com.kh
              </Link>
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-normal items-center gap-4">
              {/* <FontAwesomeIcon
                icon={faLocationDot}
                className="text-2xl md:text-lg xl:text-xl w-5"
              /> */}
              <MapPin className="h-6" />
              <span className="text-center md:text-left hover:text-primary translate duration-300">
                #D21, Street. 28, Sangkat Toulsangkae II, Khan Russeykeo, Phnom
                Penh
              </span>
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-normal items-center gap-4">
              {/* <FontAwesomeIcon
                icon={faPhone}
                className="text-2xl md:text-lg xl:text-xl w-5"
              /> */}
              <Phone className="h-6" />
              <Link
                to={formatPhoneToTelLink("85577222063")}
                className="text-center md:text-left hover:text-primary translate duration-300"
              >
                {displayPhoneNumber("85577222063")}
              </Link>
            </div>
            <div className="flex flex-col md:flex-row justify-center md:justify-normal items-center gap-4">
              {/* <FontAwesomeIcon
                icon={faEnvelope}
                className="text-2xl md:text-lg xl:text-xl w-5"
              /> */}
              <Mail className="h-6" />
              <Link
                to="mailto:lysovath.ds@gmail.com"
                className="text-center md:text-left hover:text-primary translate duration-300"
              >
                lysovath.ds@gmail.com
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <div className="text-xl font-semibold text-center md:text-right">
              FOLLOW US
            </div>
            <div className="flex justify-center md:justify-end gap-4 py-5">
              <Link to="#">
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="hover:bg-red-600 text-white p-3 bg-red-600 rounded-full text-2xl text-center hover:scale-90 transform duration-500"
                />
              </Link>
              <Link
                to="https://www.facebook.com/DevSphere.Cambodia"
                target="__blank"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="hover:bg-blue-600 text-white p-3 bg-blue-600 rounded-full text-2xl text-center hover:scale-90 transform duration-500"
                />
              </Link>
              <Link to="#">
                <FontAwesomeIcon
                  icon={faXTwitter}
                  className="hover:bg-black text-white p-3 bg-black rounded-full text-2xl text-center hover:scale-90 transform duration-500"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between text-sm border-t border-t-gray-700 mt-6 pt-6">
          <span>Copyright © DevSphere 2020</span>
          <span>All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
