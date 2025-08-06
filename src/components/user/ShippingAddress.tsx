import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { MapPin, Home, Building, User } from "lucide-react";
import { toast } from "sonner";

interface Address {
  id: number;
  title: string;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const ShippingAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<Address>>({
    title: "",
    type: "home",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
  });

  const addressTypes = [
    { label: "Home", value: "home", icon: "home" },
    { label: "Work", value: "work", icon: "building" },
    { label: "Other", value: "other", icon: "map-pin" },
  ];

  const countries = [
    { label: "United States", value: "United States" },
    { label: "Canada", value: "Canada" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Australia", value: "Australia" },
    // Add more countries as needed
  ];

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAddresses: Address[] = [
      {
        id: 1,
        title: "Home Address",
        type: "home",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        address: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        isDefault: true,
      },
      {
        id: 2,
        title: "Office",
        type: "work",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        address: "456 Business Ave, Suite 200",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "United States",
        isDefault: false,
      },
    ];

    setTimeout(() => {
      setAddresses(mockAddresses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      title: "",
      type: "home",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
    });
    setShowDialog(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowDialog(true);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success("Address deleted successfully");
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Default address updated");
  };

  const handleSaveAddress = () => {
    if (!formData.title || !formData.firstName || !formData.lastName || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...formData, id: editingAddress.id } as Address : addr
        )
      );
      toast.success("Address updated successfully");
    } else {
      // Add new address
      const newAddress: Address = {
        ...formData,
        id: Date.now(), // Simple ID generation
      } as Address;
      
      setAddresses([...addresses, newAddress]);
      toast.success("Address added successfully");
    }

    setShowDialog(false);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="w-5 h-5" />;
      case "work":
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Shipping Addresses</h2>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <Button
          label="Add Address"
          icon="pi pi-plus"
          onClick={handleAddAddress}
          className="p-button-sm"
        />
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No addresses yet</h3>
          <p className="text-gray-500 mb-4">Add your first shipping address to get started</p>
          <Button
            label="Add Address"
            icon="pi pi-plus"
            onClick={handleAddAddress}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="shadow-sm border border-gray-200">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getAddressIcon(address.type)}
                    <h3 className="font-semibold text-lg">{address.title}</h3>
                    {address.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      onClick={() => handleEditAddress(address)}
                      tooltip="Edit"
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text p-button-sm text-red-500"
                      onClick={() => handleDeleteAddress(address.id)}
                      tooltip="Delete"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{address.firstName} {address.lastName}</span>
                  </div>
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country}</p>
                  <p>{address.phone}</p>
                </div>

                {!address.isDefault && (
                  <div className="mt-4 pt-3 border-t">
                    <Button
                      label="Set as Default"
                      className="p-button-outlined p-button-sm w-full"
                      onClick={() => handleSetDefault(address.id)}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog
        header={editingAddress ? "Edit Address" : "Add New Address"}
        visible={showDialog}
        style={{ width: "90vw", maxWidth: "600px" }}
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
              onClick={handleSaveAddress}
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Address Title *</label>
            <InputText
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Home, Office, etc."
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Address Type</label>
            <Dropdown
              value={formData.type}
              options={addressTypes}
              onChange={(e) => setFormData({ ...formData, type: e.value })}
              placeholder="Select type"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">First Name *</label>
            <InputText
              value={formData.firstName || ""}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Last Name *</label>
            <InputText
              value={formData.lastName || ""}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <InputText
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Street Address *</label>
            <InputTextarea
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <InputText
              value={formData.city || ""}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State/Province</label>
            <InputText
              value={formData.state || ""}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
            <InputText
              value={formData.zipCode || ""}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <Dropdown
              value={formData.country}
              options={countries}
              onChange={(e) => setFormData({ ...formData, country: e.value })}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 mt-4">
            <Checkbox
              checked={formData.isDefault || false}
              onChange={(e) => setFormData({ ...formData, isDefault: e.checked || false })}
            />
            <label className="text-sm">Set as default address</label>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ShippingAddress;
