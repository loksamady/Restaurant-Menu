import React from "react";
import CheckoutForm from "@src/pages/site/home/components/forms/CheckoutForm";
import { toast } from "sonner";

const TestCheckout: React.FC = () => {
  const handleCheckoutSubmit = (data: {
    phone_number: string;
    address: string;
    telegram_id: string;
    telegram_username: string;
  }) => {
    console.log("Checkout form submitted:", data);
    toast.success("Checkout form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Test Checkout Form
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              How to Test:
            </h2>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• The form will auto-populate Telegram data if available</li>
              <li>• Fill in the phone number and address fields</li>
              <li>• Click "Submit Order" to test the form</li>
              <li>• Check the browser console for the submitted data</li>
            </ul>
          </div>

          <CheckoutForm onSubmit={handleCheckoutSubmit} isLoading={false} />
        </div>
      </div>
    </div>
  );
};

export default TestCheckout;
