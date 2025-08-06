import React from "react";
import { Dialog } from "primereact/dialog";
import OrderForm from "@src/pages/site/home/components/forms/OrderForm";

interface OrderCardProps {
  visible: boolean;
  onHide: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ visible, onHide }) => {
  return (
    <Dialog
      header="Complete Your Order"
      visible={visible}
      style={{ width: "90vw", maxWidth: "800px" }}
      onHide={onHide}
      dismissableMask
      draggable={false}
      resizable={false}
    >
      <OrderForm 
        onSubmitSuccess={onHide}
        onCancel={onHide}
      />
    </Dialog>
  );
};

export default OrderCard;
