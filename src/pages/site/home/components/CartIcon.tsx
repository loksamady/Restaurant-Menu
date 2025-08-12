import { ShoppingBasket } from "lucide-react";
import { useState } from "react";
import RegisterCustomerDialog from "@src/pages/site/home/components/dialog/RegisterCustomerDialog"; // Adjust path if needed

interface CartIconProps {
  className?: string;
  itemCount?: number;
  showBadge?: boolean;
  // onClick?: () => void; // Remove external onClick
}

const CartIcon: React.FC<CartIconProps> = ({
  className = "",
  itemCount = 0,
  showBadge = false,
  // onClick, // Remove external onClick
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    console.log("CartIcon clicked"); // Debug log
    setOpen(true);
  };

  return (
    <>
      <div
        className={`relative flex items-center justify-center cursor-pointer ${className}`}
        onClick={handleClick}
        style={{ zIndex: 50 }}
      >
        <ShoppingBasket className="w-5 h-5 sm:w-6 sm:h-6" />
        {showBadge && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center min-w-[16px] sm:min-w-[20px]">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </div>
      <RegisterCustomerDialog isOpen={open} setIsOpen={setOpen} />
    </>
  );
};

export default CartIcon;
