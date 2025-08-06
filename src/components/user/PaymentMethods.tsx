import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: number;
  type: "card" | "paypal" | "bank";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cardType?: "visa" | "mastercard" | "amex";
  email?: string; // for PayPal
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
  lastUsed?: string;
}

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    type: "card",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cardType: "visa",
    email: "",
    bankName: "",
    accountNumber: "",
    isDefault: false,
  });

  const paymentTypes = [
    { label: "Credit/Debit Card", value: "card" },
    { label: "PayPal", value: "paypal" },
    { label: "Bank Account", value: "bank" },
  ];

  const cardTypes = [
    { label: "Visa", value: "visa" },
    { label: "Mastercard", value: "mastercard" },
    { label: "American Express", value: "amex" },
  ];

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: 1,
        type: "card",
        cardNumber: "**** **** **** 1234",
        cardHolder: "John Doe",
        expiryDate: "12/25",
        cardType: "visa",
        isDefault: true,
        lastUsed: "2024-01-15",
      },
      {
        id: 2,
        type: "paypal",
        email: "john.doe@example.com",
        isDefault: false,
        lastUsed: "2024-01-10",
      },
    ];

    setTimeout(() => {
      setPaymentMethods(mockPaymentMethods);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddPayment = () => {
    setEditingMethod(null);
    setFormData({
      type: "card",
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cardType: "visa",
      email: "",
      bankName: "",
      accountNumber: "",
      isDefault: false,
    });
    setShowDialog(true);
  };

  const handleEditPayment = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData(method);
    setShowDialog(true);
  };

  const handleDeletePayment = (id: number) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    toast.success("Payment method deleted successfully");
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success("Default payment method updated");
  };

  const handleSavePayment = () => {
    if (formData.type === "card" && (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate)) {
      toast.error("Please fill in all card details");
      return;
    }
    if (formData.type === "paypal" && !formData.email) {
      toast.error("Please enter PayPal email");
      return;
    }
    if (formData.type === "bank" && (!formData.bankName || !formData.accountNumber)) {
      toast.error("Please fill in bank details");
      return;
    }

    if (editingMethod) {
      // Update existing payment method
      setPaymentMethods(
        paymentMethods.map((method) =>
          method.id === editingMethod.id ? { ...formData, id: editingMethod.id } as PaymentMethod : method
        )
      );
      toast.success("Payment method updated successfully");
    } else {
      // Add new payment method
      const newMethod: PaymentMethod = {
        ...formData,
        id: Date.now(),
      } as PaymentMethod;
      
      setPaymentMethods([...paymentMethods, newMethod]);
      toast.success("Payment method added successfully");
    }

    setShowDialog(false);
  };

  const getCardIcon = (cardType?: string) => {
    switch (cardType) {
      case "visa":
        return "🔵"; // Replace with actual Visa icon
      case "mastercard":
        return "🔴"; // Replace with actual Mastercard icon
      case "amex":
        return "🟢"; // Replace with actual Amex icon
      default:
        return "💳";
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="w-5 h-5" />;
      case "paypal":
        return "🅿️"; // Replace with PayPal icon
      case "bank":
        return "🏦"; // Replace with bank icon
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/\s+/g, '').replace(/[^0-9]/gi, '').replace(/(.{4})/g, '$1 ').trim();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
          <p className="text-gray-600">Manage your payment options</p>
        </div>
        <Button
          label="Add Payment"
          icon="pi pi-plus"
          onClick={handleAddPayment}
          className="p-button-sm"
        />
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No payment methods yet</h3>
          <p className="text-gray-500 mb-4">Add a payment method to make checkout faster</p>
          <Button
            label="Add Payment Method"
            icon="pi pi-plus"
            onClick={handleAddPayment}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="shadow-sm border border-gray-200">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(method.type)}
                    <h3 className="font-semibold text-lg capitalize">{method.type}</h3>
                    {method.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      onClick={() => handleEditPayment(method)}
                      tooltip="Edit"
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text p-button-sm text-red-500"
                      onClick={() => handleDeletePayment(method.id)}
                      tooltip="Delete"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-sm text-gray-600">
                  {method.type === "card" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span>{getCardIcon(method.cardType)}</span>
                        <span className="font-mono">{method.cardNumber}</span>
                      </div>
                      <p>{method.cardHolder}</p>
                      <p>Expires: {method.expiryDate}</p>
                    </>
                  )}
                  
                  {method.type === "paypal" && (
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>{method.email}</span>
                    </div>
                  )}
                  
                  {method.type === "bank" && (
                    <>
                      <p>{method.bankName}</p>
                      <p className="font-mono">****{method.accountNumber?.slice(-4)}</p>
                    </>
                  )}
                  
                  {method.lastUsed && (
                    <p className="text-xs text-gray-500">
                      Last used: {new Date(method.lastUsed).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {!method.isDefault && (
                  <div className="mt-4 pt-3 border-t">
                    <Button
                      label="Set as Default"
                      className="p-button-outlined p-button-sm w-full"
                      onClick={() => handleSetDefault(method.id)}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Payment Method Dialog */}
      <Dialog
        header={editingMethod ? "Edit Payment Method" : "Add Payment Method"}
        visible={showDialog}
        style={{ width: "90vw", maxWidth: "500px" }}
        onHide={() => setShowDialog(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={handleSavePayment}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Type</label>
            <Dropdown
              value={formData.type}
              options={paymentTypes}
              onChange={(e) => setFormData({ ...formData, type: e.value })}
              className="w-full"
            />
          </div>

          {formData.type === "card" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <InputText
                  value={formData.cardNumber || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    cardNumber: formatCardNumber(e.target.value)
                  })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Card Holder Name</label>
                <InputText
                  value={formData.cardHolder || ""}
                  onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                  placeholder="John Doe"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <InputText
                    value={formData.expiryDate || ""}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Card Type</label>
                  <Dropdown
                    value={formData.cardType}
                    options={cardTypes}
                    onChange={(e) => setFormData({ ...formData, cardType: e.value })}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          {formData.type === "paypal" && (
            <div>
              <label className="block text-sm font-medium mb-2">PayPal Email</label>
              <InputText
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                type="email"
                className="w-full"
              />
            </div>
          )}

          {formData.type === "bank" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Bank Name</label>
                <InputText
                  value={formData.bankName || ""}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Your Bank Name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <InputText
                  value={formData.accountNumber || ""}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Account Number"
                  className="w-full"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              checked={formData.isDefault || false}
              onChange={(e) => setFormData({ ...formData, isDefault: e.checked || false })}
            />
            <label className="text-sm">Set as default payment method</label>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;
