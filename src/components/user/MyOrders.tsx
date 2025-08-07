import React, { useState } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Calendar, Package, DollarSign } from "lucide-react";
import { IMAGE_URL } from "@src/constant/env";
import { orderStore } from "@src/state/order";
import { toast } from "sonner";

interface MyOrdersProps {
  visible?: boolean;
  onHide?: () => void;
}

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

const MyOrders: React.FC<MyOrdersProps> = ({ visible, onHide }) => {
  const orders = orderStore((state) => state.orders);
  const markOrderAsSubmitted = orderStore(
    (state) => state.markOrderAsSubmitted
  );
  const removeOrder = orderStore((state) => state.removeOrder);
  const removeCancelledOrders = orderStore(
    (state) => state.removeCancelledOrders
  );

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(
    null
  );
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

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
      // TODO: Implement actual order submission to API
      // For now, we'll just mark it as submitted locally
      console.log("Submitting order:", order);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      markOrderAsSubmitted(order.orderId);
      toast.success("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setSubmittingOrderId(null);
    }
  };

  // Function to show delete confirmation
  const confirmDeleteOrder = (order: Order) => {
    confirmDialog({
      message: `Are you sure you want to permanently delete order ${order.orderNumber}? This action cannot be undone and the order will be completely removed from your history.`,
      header: "Delete Order Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDeleteOrder(order),
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  // Function to delete order
  const handleDeleteOrder = async (order: Order) => {
    if (order.status !== "pending" && order.status !== "confirmed") {
      toast.error("Only pending or confirmed orders can be deleted");
      return;
    }

    setDeletingOrderId(order.orderId);

    try {
      // Import user service function
      const { decreaseUserOrderCount } = await import(
        "../../services/userService"
      );

      // Remove order completely from the store
      removeOrder(order.orderId);

      // Decrease user order statistics
      const orderAmount = order.totalAmount || 0;
      const savings = order.totalSavings || 0;
      decreaseUserOrderCount(orderAmount, savings);

      toast.success(
        `Order ${order.orderNumber} has been deleted and statistics updated!`
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      // Still remove order even if user statistics update fails
      removeOrder(order.orderId);
      toast.success(`Order ${order.orderNumber} has been deleted!`);
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Function to clear all cancelled orders
  const handleClearCancelledOrders = () => {
    const cancelledOrdersCount = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    if (cancelledOrdersCount === 0) {
      toast.info("No cancelled orders to clear");
      return;
    }

    confirmDialog({
      message: `Are you sure you want to permanently delete all ${cancelledOrdersCount} cancelled orders? This action cannot be undone.`,
      header: "Clear Cancelled Orders",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        try {
          removeCancelledOrders();
          toast.success(
            `${cancelledOrdersCount} cancelled orders have been cleared successfully!`
          );
        } catch (error) {
          console.error("Error clearing cancelled orders:", error);
          toast.error("Failed to clear cancelled orders. Please try again.");
        }
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  const orderTemplate = (order: Order) => {
    const isCancelled = order.status === "cancelled";

    return (
      <Card
        className={`mb-4 shadow-sm border border-gray-200 ${
          isCancelled ? "opacity-75 bg-red-50 border-red-200" : ""
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Order Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`text-lg font-semibold ${
                  isCancelled ? "text-red-600 line-through" : "text-gray-800"
                }`}
              >
                {order.orderNumber}
              </h3>
              <div className="flex items-center gap-1">
                <i className={getStatusIcon(order.status)}></i>
                <Badge
                  value={order.status.toUpperCase()}
                  severity={getStatusSeverity(order.status)}
                />
              </div>
              {isCancelled && (
                <span className="text-red-600 text-sm font-medium bg-red-100 px-2 py-1 rounded">
                  CANCELLED
                </span>
              )}
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
            {(order.status === "pending" || order.status === "confirmed") && (
              <Button
                label={
                  deletingOrderId === order.orderId ? "Deleting..." : "Delete"
                }
                icon={
                  deletingOrderId === order.orderId
                    ? "pi pi-spin pi-spinner"
                    : "pi pi-trash"
                }
                className="p-button-danger p-button-outlined p-button-sm"
                disabled={deletingOrderId === order.orderId}
                onClick={() => confirmDeleteOrder(order)}
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
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => setStatusFilter(e.value)}
          placeholder="Filter by status"
          className="w-full sm:w-auto"
        />
        {/* Clear Cancelled Orders Button */}
        {orders.some((order) => order.status === "cancelled") && (
          <Button
            label="Clear Cancelled"
            icon="pi pi-trash"
            className="p-button-danger p-button-outlined p-button-sm"
            onClick={handleClearCancelledOrders}
            tooltip="Remove all cancelled orders"
          />
        )}
      </div>
    </div>
  );

  if (filteredOrders.length === 0) {
    return (
      <div>
        {header}
        <ConfirmDialog />
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
        </div>
      </div>
    );
  }

  // If used as a dialog (visible prop provided), wrap in Dialog
  if (visible !== undefined) {
    return (
      <Dialog
        header="My Orders"
        visible={visible}
        style={{ width: "95vw", maxWidth: "1200px", height: "90vh" }}
        onHide={onHide || (() => {})}
        dismissableMask
        draggable={false}
        resizable={false}
        className="my-orders-dialog"
      >
        <div>
          {header}
          <ConfirmDialog />
          <DataView
            value={filteredOrders}
            itemTemplate={orderTemplate}
            paginator
            rows={5}
            emptyMessage="No orders found"
          />
        </div>
      </Dialog>
    );
  }

  // Default return for standalone usage
  return (
    <div>
      {header}
      <ConfirmDialog />
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
