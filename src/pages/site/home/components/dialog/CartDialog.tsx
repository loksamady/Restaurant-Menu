import { Button } from "primereact/button";
import { ShoppingBasket } from "lucide-react";
import { Dialog } from "primereact/dialog";

interface CartMenu {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Add other fields as needed
}

interface CartDialogProps {
  visible: boolean;
  onHide: () => void;
  cartMenus: CartMenu[];
  handleResetCart: () => void;
  handleCheckout: () => void;
  calculateTotal: () => number;
}

const CartDialog: React.FC<CartDialogProps> = ({
  visible,
  onHide,
  cartMenus,
  handleResetCart,
  handleCheckout,
}) => (
  <Dialog
    header="Shopping Cart"
    visible={visible}
    style={{ width: "95vw", maxWidth: "600px", minWidth: "320px" }}
    onHide={onHide}
    className="cart-dialog"
    contentStyle={{ padding: "0", maxHeight: "70vh", overflow: "hidden" }}
    headerStyle={{ padding: "1rem", fontSize: "1.1rem" }}
    footer={
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-2">
        <Button
          label="Reset Cart"
          icon="pi pi-trash"
          onClick={handleResetCart}
          className="p-button-danger p-button-outlined w-full sm:w-auto text-xs sm:text-sm"
          disabled={cartMenus.length === 0}
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            label="Checkout"
            icon="pi pi-check"
            onClick={handleCheckout}
            disabled={cartMenus.length === 0}
            className="w-full sm:w-auto text-xs sm:text-sm"
          />
        </div>
      </div>
    }
  >
    <div className="m-0 p-2 sm:p-4 max-h-full overflow-hidden flex flex-col">
      {cartMenus.length > 0 ? (
        <div className="flex flex-col h-full">
          <div className="mb-4">
            {/* ...existing code for cart summary and items... */}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <ShoppingBasket
            size={40}
            className="mx-auto mb-3 text-gray-400 sm:w-12 sm:h-12"
          />
          <p className="text-gray-600 text-sm sm:text-base">
            Your cart is empty
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Add some products to get started!
          </p>
        </div>
      )}
    </div>
  </Dialog>
);

export default CartDialog;
