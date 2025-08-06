import React, { useState } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { Calendar, Package, DollarSign } from "lucide-react";
import { IMAGE_URL } from "@src/constant/env";
import { orderStore } from "@src/state/order";
import { createOrder } from "@src/api/service/site/customer.service";
import { toast } from "sonner";
import { CreateOrderType } from "@src/types/customer";

interface Order {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  items: Array<{
    menuId: number;
    name: string;
    quantity: number;
    price: number;
    originalPrice: number;
    image?: string;
    filePath?: string;
  }>;
  totalAmount: number;
  originalAmount: number;
  totalSavings: number;
  deliveryAddress?: string;
  specialInstructions?: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    paymentMethod: string;
  };
  submittedToApi: boolean;
  estimatedDeliveryTime?: string;
}

const MyOrders: React.FC = () => {
  const orders = orderStore((state) => state.orders);
  const markOrderAsSubmitted = orderStore(
    (state) => state.markOrderAsSubmitted
  );

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(
    null
  );

  const statusOptions = [
    { label: "All Orders", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const getStatusSeverity = (
    status: string
  ): "success" | "danger" | "warning" | "info" | null => {
    switch (status) {
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      case "preparing":
      case "ready":
        return "warning";
      case "confirmed":
        return "info";
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return "pi pi-check-circle";
      case "cancelled":
        return "pi pi-times-circle";
      case "preparing":
        return "pi pi-clock";
      case "ready":
        return "pi pi-bell";
      case "confirmed":
        return "pi pi-info-circle";
      default:
        return "pi pi-circle";
    }
  };

  // Function to submit order to API
  const handleSubmitOrder = async (order: Order) => {
    if (order.submittedToApi) {
      toast.info("Order has already been submitted to API");
      return;
    }

    setSubmittingOrderId(order.orderId);

    try {
      const orderData: CreateOrderType = {
        items: order.items.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
        })),
        deliveryAddress: order.deliveryAddress || undefined,
        specialInstructions: order.specialInstructions || undefined,
        paymentMethod: order.customerInfo.paymentMethod as
          | "cash"
          | "card"
          | "online",
      };

      await createOrder(orderData);
      markOrderAsSubmitted(order.orderId);

      toast.success("Order submitted successfully to API!");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order to API. Please try again.");
    } finally {
      setSubmittingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  const orderTemplate = (order: Order) => {
    return (
      <Card className="mb-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Order Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {order.orderNumber}
              </h3>
              <div className="flex items-center gap-1">
                <i className={getStatusIcon(order.status)}></i>
                <Badge
                  value={order.status.toUpperCase()}
                  severity={getStatusSeverity(order.status)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{order.items.length} item(s)</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                >
                  <img
                    src={
                      item.image
                        ? `${IMAGE_URL}/${item.image}`
                        : "/placeholder-food.jpg"
                    }
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Customer & Delivery Info */}
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <div>
                <strong>Customer:</strong> {order.customerInfo.name} -{" "}
                {order.customerInfo.phone}
              </div>
              {order.customerInfo.email && (
                <div>
                  <strong>Email:</strong> {order.customerInfo.email}
                </div>
              )}
              {order.deliveryAddress && (
                <div>
                  <strong>Delivery:</strong> {order.deliveryAddress}
                </div>
              )}
              {order.specialInstructions && (
                <div>
                  <strong>Notes:</strong> {order.specialInstructions}
                </div>
              )}
              <div>
                <strong>Payment:</strong>{" "}
                {order.customerInfo.paymentMethod.toUpperCase()}
              </div>
              {order.totalSavings > 0 && (
                <div className="text-green-600">
                  <strong>Total Savings:</strong> $
                  {order.totalSavings.toFixed(2)}
                </div>
              )}
            </div>

            {/* {order.deliveryAddress && (
              <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{order.deliveryAddress}</span>
              </div>
            )} */}

            {/* {order.estimatedDeliveryTime && order.status !== "delivered" && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  Estimated delivery:{" "}
                  {new Date(order.estimatedDeliveryTime).toLocaleString()}
                </span>
              </div>
            )} */}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {/* Submit to API button for orders not yet submitted */}
            {!order.submittedToApi && (
              <Button
                label={
                  submittingOrderId === order.orderId
                    ? "Submitting..."
                    : "Submit to API"
                }
                icon={
                  submittingOrderId === order.orderId
                    ? "pi pi-spin pi-spinner"
                    : "pi pi-send"
                }
                className="p-button-success p-button-sm"
                disabled={submittingOrderId === order.orderId}
                onClick={() => handleSubmitOrder(order)}
              />
            )}

            {/* API Submission Status */}
            {order.submittedToApi && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <i className="pi pi-check-circle"></i>
                <span>Submitted to API</span>
              </div>
            )}

            <Button
              label="View Details"
              icon="pi pi-eye"
              className="p-button-outlined p-button-sm"
              onClick={() => {
                // Handle view details
                console.log("View order details:", order.orderId);
              }}
            />
            {/* {order.status === "delivered" && (
              <Button
                label="Reorder"
                icon="pi pi-refresh"
                className="p-button-sm"
                onClick={() => {
                  // Handle reorder
                  console.log("Reorder:", order.orderId);
                }}
              />
            )} */}
            {(order.status === "pending" || order.status === "confirmed") && (
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-danger p-button-outlined p-button-sm"
                onClick={() => {
                  // Handle cancel order
                  console.log("Cancel order:", order.orderId);
                }}
              />
            )}
          </div>
        </div>
      </Card>
    );
  };

  const header = (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <p className="text-gray-600">Track and manage your order history</p>
      </div>
      <Dropdown
        value={statusFilter}
        options={statusOptions}
        onChange={(e) => setStatusFilter(e.value)}
        placeholder="Filter by status"
        className="w-full sm:w-auto"
      />
    </div>
  );

  if (filteredOrders.length === 0) {
    return (
      <div>
        {header}
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {statusFilter === "all"
              ? "No orders yet"
              : `No ${statusFilter} orders`}
          </h3>
          <p className="text-gray-500 mb-4">
            {statusFilter === "all"
              ? "Start browsing our menu to place your first order!"
              : `You don't have any ${statusFilter} orders.`}
          </p>
          {statusFilter === "all" && (
            <Button
              label="Browse Menu"
              icon="pi pi-utensils"
              onClick={() => {
                // Navigate to menu
                window.location.href = "/";
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {header}
      <DataView
        value={filteredOrders}
        itemTemplate={orderTemplate}
        paginator
        rows={5}
        emptyMessage="No orders found"
      />
    </div>
  );
};

export default MyOrders;
