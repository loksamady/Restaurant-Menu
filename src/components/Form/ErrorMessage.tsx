import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

type Props = {
  message?: string;
};

const framer_error = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

function ErrorMessage({ message }: Props) {
  return message ? (
    <motion.p
      className="absolute -bottom-2 right-2 px-1 pb-0.5 flex items-center gap-1 font-semibold text-xs text-red-500 bg-red-100 rounded-md"
      {...framer_error}
    >
      <FontAwesomeIcon icon={faWarning} />
      <span>{message}</span>
    </motion.p>
  ) : null;
}

export default ErrorMessage;
