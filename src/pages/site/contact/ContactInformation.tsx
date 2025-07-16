import {
  faFacebook,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCircleInfo,
  faEnvelopeOpen,
  faLocationPin,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "primereact/divider";
import { Link } from "react-router-dom";

const ContactInformation = () => {
  return (
    <div className="flex flex-col gap-4 bg-csx-color-3 text-white p-4 rounded-xl h-full">
      <p className="text-xl font-semibold flex items-center gap-3">
        <FontAwesomeIcon icon={faCircleInfo} /> Information
      </p>
      <Divider className="my-0" />
      <div className="flex flex-col gap-6 items-center  h-full mt-8">
        <ul className="flex flex-col gap-4 text-base cursor-pointer">
          <li>
            <FontAwesomeIcon icon={faLocationPin} className="mr-4 font-bold" />
            #D21, Strett. 28, Sangkat Toulsangkae II, Khan Russeykeo, Phnom Penh
          </li>
          <li>
            <FontAwesomeIcon icon={faPhone} className="mr-4 font-bold" />
            (855) 077 222 063
          </li>
          <li>
            <FontAwesomeIcon icon={faEnvelopeOpen} className="mr-4 font-bold" />
            lysovath.ds@gmail.com
          </li>
        </ul>
        <div className="flex flex-col gap-6">
          <p className="font-semibold text-center">FOLLOW US </p>
          <div className="flex justify-center items-center gap-3 h-full">
            <Link
              to="https://www.facebook.com/DevSphere.Cambodia"
              target="__blank"
            >
              <FontAwesomeIcon
                icon={faYoutube}
                className="hover:bg-red-600 hover:text-white text-red-600 p-3 border border-red-600 rounded-full text-2xl text-center hover:scale-90 transform duration-500"
              />
            </Link>
            <Link
              to="https://www.facebook.com/DevSphere.Cambodia"
              target="__blank"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className="hover:bg-blue-600 hover:text-white text-blue-600 p-3 border border-blue-600 rounded-full text-2xl text-center hover:scale-90 transform duration-500"
              />
            </Link>
            <Link
              to="https://www.facebook.com/DevSphere.Cambodia"
              target="__blank"
            >
              <FontAwesomeIcon
                icon={faXTwitter}
                className="hover:bg-black hover:text-white text-white p-3 border border-white rounded-full text-2xl text-center hover:scale-90 transform duration-500"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
