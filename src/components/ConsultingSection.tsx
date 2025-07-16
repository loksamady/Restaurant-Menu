import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LngLink from "./LngLink";

const ConsultingSection = () => {
  return (
    <div className="bg-csx-color-3 py-4">
      <div className="max-w-screen-lg mx-auto items-center grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="text-white ">
          <p className="font-semibold text-xl mb-5 text-center md:text-start">
            Meet our team for free consulting
          </p>
          <p className="text-xs">
            Our specialists are happy for meeting you to discuss about your
            challenges and provide solutiion through technology
          </p>
        </div>
        <div className="flex justify-end">
          <LngLink
            to="/contact"
            className="flex gap-2 items-center justify-center text-lg  px-8 rounded-md border-2 border-white py-4 text-white hover:bg-white hover:text-csx-color-1 transition-colors duration-300 w-full md:w-auto font-semibold"
          >
            <p>Get Quote</p>
            <FontAwesomeIcon icon={faArrowRight} className="font-bold" />
          </LngLink>
        </div>
      </div>
    </div>
  );
};

export default ConsultingSection;
