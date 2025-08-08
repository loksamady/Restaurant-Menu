import React from "react";
import { Button } from "primereact/button";

interface OrderFormProps {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmitSuccess, onCancel }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Order Form</h3>
      <p className="text-gray-600 mb-4">
        Order form functionality will be implemented here.
      </p>
      <div className="flex gap-2">
        <Button
          label="Place Order"
          className="flex-1"
          disabled
          onClick={onSubmitSuccess}
        />
        <Button
          label="Cancel"
          severity="secondary"
          className="flex-1"
          onClick={onCancel}
        />
      </div>
    </div>
  );
};

export default OrderForm;
