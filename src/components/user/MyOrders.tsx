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

// Order type is imported from store, but kept here for clarity
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
    id?: number | string;
    name: string;
    phone: string;
    profile_picture?: string;
    username?: string;
    languageCode?: string;
    isPremium?: boolean;
    create_at?: string;
    email?: string;
    address?: string;
    notes?: string;
    paymentMethod?: string;
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

  // Status options for filtering
  const statusOptions = [
    { label: "All Orders", value: "all", icon: "pi pi-list" },
    { label: "Pending", value: "pending", icon: "pi pi-clock" },
    { label: "Confirmed", value: "confirmed", icon: "pi pi-info-circle" },
    { label: "Preparing", value: "preparing", icon: "pi pi-cog" },
    { label: "Ready", value: "ready", icon: "pi pi-bell" },
    { label: "Delivered", value: "delivered", icon: "pi pi-check-circle" },
    { label: "Cancelled", value: "cancelled", icon: "pi pi-times-circle" },
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

  // Mark order as submitted (simulated API submission)
  const handleSubmitOrder = async (order: Order) => {
    if (order.submittedToApi) {
      toast.info("Order has already been submitted");
      return;
    }

    setSubmittingOrderId(order.orderId);

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mark order as submitted in the store
      markOrderAsSubmitted(order.orderId);

      toast.success(`Order ${order.orderNumber} submitted successfully!`);

      // Optional: Log the order data that would be sent to API
      console.log("Order data that would be sent to API:", {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        items: order.items.map((item) => ({
          menuId: item.menuId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: order.totalAmount,
        customerInfo: order.customerInfo,
        deliveryAddress: order.deliveryAddress,
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setSubmittingOrderId(null);
    }
  };

  // Show delete confirmation dialog
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

  // Delete order from store
  const handleDeleteOrder = async (order: Order) => {
    if (order.status !== "pending" && order.status !== "confirmed") {
      toast.error("Only pending or confirmed orders can be deleted");
      return;
    }

    setDeletingOrderId(order.orderId);

    try {
      // Remove order completely from the store
      removeOrder(order.orderId);

      toast.success(
        `Order ${order.orderNumber} has been deleted successfully!`
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order. Please try again.");
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Clear all cancelled orders from store
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

  // Filter out duplicate orders by orderId
  const uniqueOrdersMap = new Map<string, Order>();
  orders.forEach((order) => {
    if (!uniqueOrdersMap.has(order.orderId)) {
      uniqueOrdersMap.set(order.orderId, order);
    }
  });
  const uniqueOrders = Array.from(uniqueOrdersMap.values());

  const filteredOrders = uniqueOrders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  // Render a single order card
  const orderTemplate = (order: Order) => {
    const isCancelled = order.status === "cancelled";

    return (
      <Card
        className={`mb-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
          isCancelled
            ? "opacity-75 bg-red-50 border-red-200"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Order Info */}
          <div className="flex-1">
            {/* Order Header */}
            <div className="flex items-center gap-3 mb-3">
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
              {order.submittedToApi && (
                <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded">
                  SUBMITTED
                </span>
              )}
            </div>

            {/* Order Summary */}
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                <span className="text-gray-400">
                  {new Date(order.orderDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{order.items.length} item(s)</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold text-gray-800">
                  ${order.totalAmount.toFixed(2)}
                </span>
                {order.totalSavings > 0 && (
                  <span className="text-green-600 text-xs">
                    (Saved ${order.totalSavings.toFixed(2)})
                  </span>
                )}
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
              {order.customerInfo && (
                <div className="flex items-center gap-3 mb-2">
                  {order.customerInfo.profile_picture && (
                    <img
                      src={
                        order.customerInfo.profile_picture.startsWith("http")
                          ? order.customerInfo.profile_picture
                          : `${IMAGE_URL}/${order.customerInfo.profile_picture}`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full border"
                    />
                  )}
                  <span className="font-semibold">
                    {order.customerInfo.name}
                  </span>
                  {order.customerInfo.username && (
                    <span className="text-xs text-gray-500 ml-2">
                      @{order.customerInfo.username}
                    </span>
                  )}
                  {order.customerInfo.phone && (
                    <span className="text-xs text-gray-500 ml-2">
                      {order.customerInfo.phone}
                    </span>
                  )}
                  {order.customerInfo.languageCode && (
                    <span className="text-xs text-gray-500 ml-2">
                      {order.customerInfo.languageCode}
                    </span>
                  )}
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
            {/* Submit Order button for orders not yet submitted */}
            {!order.submittedToApi && (
              <Button
                label={
                  submittingOrderId === order.orderId
                    ? "Submitting..."
                    : "Submit Order"
                }
                icon={
                  submittingOrderId === order.orderId
                    ? "pi pi-spin pi-spinner"
                    : "pi pi-send"
                }
                className="p-button-success p-button-sm"
                disabled={submittingOrderId === order.orderId}
                onClick={() => handleSubmitOrder(order)}
                tooltip="Submit this order for processing"
              />
            )}

            {/* Order Submission Status */}
            {order.submittedToApi && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <i className="pi pi-check-circle"></i>
                <span>Order Submitted</span>
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

  // Header for orders view
  const header = (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            optionLabel="label"
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

      {/* Order Statistics */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {uniqueOrders.length}
            </div>
            <div className="text-sm text-blue-800">Total Orders</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter((order) => order.submittedToApi).length}
            </div>
            <div className="text-sm text-green-800">Submitted</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                uniqueOrders.filter((order) => order.status === "pending")
                  .length
              }
            </div>
            <div className="text-sm text-orange-800">Pending</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              $
              {uniqueOrders
                .reduce((total, order) => total + order.totalAmount, 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-purple-800">Total Spent</div>
          </div>
        </div>
      )}
    </div>
  );

  // No orders found view
  if (filteredOrders.length === 0) {
    return (
      <div>
        {header}
        <ConfirmDialog />
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-600 mb-3">
            {statusFilter === "all"
              ? "No orders yet"
              : `No ${statusFilter} orders`}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {statusFilter === "all"
              ? "Start browsing our delicious menu to place your first order! Every great meal begins with a single order."
              : `You don't have any ${statusFilter} orders at the moment.`}
          </p>
          {statusFilter === "all" && (
            <Button
              label="Browse Menu"
              icon="pi pi-search"
              className="p-button-outlined"
              onClick={() => {
                // This could navigate to menu or close dialog
                if (onHide) onHide();
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Dialog wrapper for modal usage
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
