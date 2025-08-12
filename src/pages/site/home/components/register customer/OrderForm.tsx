import React from "react";

interface OrderFormProps {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = () => {
  // Placeholder for future order form implementation
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Order Form</h3>
      <p className="text-gray-600 mb-4">
        Order form functionality will be implemented here.
      </p>
    </div>
  );
};

export default OrderForm;
