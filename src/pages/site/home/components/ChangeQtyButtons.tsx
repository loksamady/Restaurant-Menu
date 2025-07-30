import { userStore } from "@src/state/store";
import { Minus, Plus } from "lucide-react";

type Props = { menuId: number };

const ChangeQtyButtons = ({ menuId }: Props) => {
  const getMenuById = userStore((state) => state.getMenuById);
  const decreaseQuantity = userStore((state) => state.decreaseQuantity);
  const increaseQuantity = userStore((state) => state.increaseQuantity);

  const menu = getMenuById(menuId.toString());

  return (
    <>
      {menu && (
        <div className="flex items-center gap-2">
          <button onClick={() => decreaseQuantity(menuId.toString())}>
            <Minus className="bg-gray-200 p-1 rounded" />
          </button>
          <span>{menu.quantity}</span>
          <button onClick={() => increaseQuantity(menuId.toString())}>
            <Plus className="bg-gray-200 p-1 rounded" />
          </button>
        </div>
      )}
    </>
  );
};

export default ChangeQtyButtons;
