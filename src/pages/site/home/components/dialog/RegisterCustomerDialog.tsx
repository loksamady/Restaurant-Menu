import { Dialog } from "primereact/dialog";
import React from "react";
import CheckoutForm from "../register customer/CheckoutForm";

// Define the shape of the checkout form data
interface CheckoutFormData {
  // Add appropriate fields, for example:
  name: string;
  address: string;
  phone: string;
  // Add more fields as needed
}

// Add prop types
interface RegisterCustomerDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isSubmittingOrder: boolean;
  handleCheckoutSubmit: (data: CheckoutFormData) => void;
}

const RegisterCustomerDialog: React.FC<RegisterCustomerDialogProps> = ({
  isOpen,
  setIsOpen,
  isSubmittingOrder,
}) => {
  // Simple handler: just log the data
  const handleCheckoutSubmit = (data: CheckoutFormData) => {
    console.log("Submitted customer data:", data);
  };

  return (
    <Dialog
      header="Checkout"
      visible={isOpen}
      style={{ width: "95vw", maxWidth: "500px", minWidth: "320px" }}
      onHide={() => setIsOpen(false)}
      className="checkout-dialog"
      contentStyle={{ padding: "1rem", maxHeight: "70vh", overflow: "auto" }}
      headerStyle={{ padding: "1rem", fontSize: "1.1rem" }}
    >
      <CheckoutForm
        onSubmit={handleCheckoutSubmit}
        isSubmitting={isSubmittingOrder}
        onHide={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

export default RegisterCustomerDialog;
