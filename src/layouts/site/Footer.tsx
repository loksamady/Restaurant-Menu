import {
  faAngleRight,
  faEnvelopeOpen,
  faLocationPin,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FooterImge from "@src/assets/image/footer.png";
import FooterLogoImge from "@src/assets/Logo/logo-white.png";
import { Link } from "react-router-dom";
import {
  faFacebook,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Divider } from "primereact/divider";
const Footer = () => {
  return (
    <div className="relative py-7" id="contact">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${FooterImge})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top",
          filter: "brightness(50%)", // Optional: adjust brightness
        }}
      />
      {/* Color Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-950 to-black opacity-90" />

      {/* Content */}
      <div className="relative max-w-screen-lg mx-auto p-4 flex flex-col gap-12 z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white items-start">
          <div className="mt-6 hidden md:block">
            <img src={FooterLogoImge} />
          </div>
          <div>
            <p className="mb-4 font-semibold">CONTACT US</p>
            <ul className="flex flex-col gap-2 text-base cursor-pointer">
              <li>
                <FontAwesomeIcon
                  icon={faLocationPin}
                  className="mr-4 font-bold"
                />
                #D21, Strett. 28, Sangkat Toulsangkae II, Khan Russeykeo, Phnom
                Penh
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} className="mr-4 font-bold" />
                (855) 077 222 063
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faEnvelopeOpen}
                  className="mr-4 font-bold"
                />
                lysovath.ds@gmail.com
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-semibold">SERVICES </p>
            <ul className="flex flex-col gap-2 text-base cursor-pointer">
              <li>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="mr-6 font-bold  text-xs"
                />
                Web Development
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="mr-6 font-bold  text-xs"
                />
                Mobile App Development
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="mr-6 font-bold  text-xs"
                />
                Digital Marketing
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="mr-6 font-bold  text-xs"
                />
                Blockchain
              </li>
            </ul>
          </div>
          <div className="h-full">
            <p className="mb-4 font-semibold text-center">FOLLOW US </p>
            <div className="flex justify-center items-center gap-3 h-full md:-mt-12">
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
                  className="hover:bg-black hover:text-white text-black p-3 border border-black rounded-full text-2xl text-center hover:scale-90 transform duration-500"
                />
              </Link>
            </div>
          </div>
        </div>
        <Divider className="my-0 " />
        <p className="text-center font-semibold text-base text-white">
          Copyright © 2024 DevSphere, All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
