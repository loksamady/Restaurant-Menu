import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Chip } from "primereact/chip";
import { orderStore } from "@src/state/order";
import { Order } from "@src/types/order";
import { IMAGE_URL } from "@src/constant/env";
import { toast } from "sonner";

interface MyOrdersProps {
  visible: boolean;
  onHide: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ visible, onHide }) => {
  const orders = orderStore((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (
    status: Order["status"]
  ): "warning" | "info" | "success" | "danger" => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "preparing":
        return "info";
      case "ready":
        return "success";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "info";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch {
      return dateString;
    }
  };

  const OrderDetailDialog = () => (
    <Dialog
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
            <p className="text-sm text-gray-600">
              {selectedOrder?.orderNumber}
            </p>
          </div>
          {selectedOrder && (
            <Badge
              value={getStatusText(selectedOrder.status)}
              severity={getStatusColor(selectedOrder.status)}
              className="text-sm px-3 py-1"
            />
          )}
        </div>
      }
      visible={!!selectedOrder}
      style={{ width: "95vw", maxWidth: "900px" }}
      onHide={() => setSelectedOrder(null)}
      maximizable
    >
      {selectedOrder && (
        <div className="space-y-6">
          {/* Order Overview Card */}
          <Card className="shadow-lg border-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <i className="pi pi-calendar text-2xl text-blue-600 mb-2"></i>
                <h4 className="font-semibold text-gray-800">Order Date</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedOrder.orderDate)}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <i className="pi pi-shopping-cart text-2xl text-green-600 mb-2"></i>
                <h4 className="font-semibold text-gray-800">Total Items</h4>
                <p className="text-lg font-bold text-green-600">
                  {selectedOrder.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <i className="pi pi-dollar text-2xl text-orange-600 mb-2"></i>
                <h4 className="font-semibold text-gray-800">Total Amount</h4>
                <p className="text-lg font-bold text-orange-600">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          {/* Customer Information Card */}
          <Card
            title="Customer Information"
            className="shadow-md"
            pt={{ content: { className: "pt-0" } }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="pi pi-user text-blue-600"></i>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold">
                      {selectedOrder.customerInfo.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="pi pi-phone text-green-600"></i>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold">
                      {selectedOrder.customerInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {selectedOrder.customerInfo.email && (
                  <div className="flex items-center space-x-3">
                    <i className="pi pi-envelope text-purple-600"></i>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold">
                        {selectedOrder.customerInfo.email}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <i className="pi pi-map-marker text-red-600"></i>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <Chip
                      label={selectedOrder.customerInfo.paymentMethod.toUpperCase()}
                      className="bg-blue-100 text-blue-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {selectedOrder.customerInfo.address && (
              <>
                <Divider />
                <div className="flex items-start space-x-3">
                  <i className="pi pi-home text-orange-600 mt-1"></i>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-semibold text-gray-800 leading-relaxed">
                      {selectedOrder.customerInfo.address}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Telegram Information from Notes */}
            {selectedOrder.customerInfo.notes && (
              <>
                <Divider />
                <div className="flex items-start space-x-3">
                  <i className="pi pi-send text-blue-600 mt-1"></i>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      Telegram Information
                    </p>
                    <p className="font-semibold text-gray-800">
                      {selectedOrder.customerInfo.notes}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Order Items Card */}
          <Card
            title={`Order Items (${selectedOrder.items.length})`}
            className="shadow-md"
            pt={{ content: { className: "pt-0" } }}
          >
            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={
                          item.filePath ||
                          (item.image
                            ? `${IMAGE_URL}/${item.image}`
                            : "/placeholder-food.jpg")
                        }
                        alt={item.nameEn || item.name}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-food.jpg";
                        }}
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-800 text-lg">
                        {item.nameEn || item.name}
                      </h5>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        {item.discount && item.discount > 0 && (
                          <Chip
                            label={`${item.discount}% OFF`}
                            className="bg-red-100 text-red-700 text-xs"
                          />
                        )}
                      </div>

                      {item.discount && item.discount > 0 ? (
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-lg font-bold text-green-600">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.discount && item.discount > 0 && (
                      <p className="text-sm text-green-600 font-semibold">
                        Saved: $
                        {(
                          (item.originalPrice - item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Summary Card */}
          <Card
            title="Order Summary"
            className="shadow-md border-t-4 border-t-green-500"
            pt={{ content: { className: "pt-0" } }}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">
                  Subtotal ({selectedOrder.items.length} items):
                </span>
                <span className="font-semibold">
                  ${selectedOrder.originalAmount.toFixed(2)}
                </span>
              </div>

              {selectedOrder.totalSavings > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-green-600 font-semibold flex items-center">
                    <i className="pi pi-tag mr-2"></i>
                    Total Savings:
                  </span>
                  <span className="text-green-600 font-bold">
                    -${selectedOrder.totalSavings.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4 border-2 border-green-200">
                <span className="text-xl font-bold text-gray-800">
                  Final Total:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>

              {selectedOrder.totalSavings > 0 && (
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center text-green-700">
                    <i className="pi pi-check-circle text-xl mr-2"></i>
                    <span className="font-semibold">
                      You saved ${selectedOrder.totalSavings.toFixed(2)} on this
                      order!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Special Instructions */}
          {selectedOrder.specialInstructions && (
            <Card
              title="Special Instructions"
              className="shadow-md border-l-4 border-l-blue-500"
              pt={{ content: { className: "pt-0" } }}
            >
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {selectedOrder.specialInstructions}
                </p>
              </div>
            </Card>
          )}

          {/* Estimated Delivery Time */}
          {selectedOrder.estimatedDeliveryTime && (
            <Card
              title="Delivery Information"
              className="shadow-md border-l-4 border-l-orange-500"
              pt={{ content: { className: "pt-0" } }}
            >
              <div className="flex items-center space-x-3 bg-orange-50 p-4 rounded-lg">
                <i className="pi pi-clock text-orange-600 text-xl"></i>
                <div>
                  <p className="text-sm text-gray-600">
                    Estimated Delivery Time
                  </p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(selectedOrder.estimatedDeliveryTime)}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              label="Print Order"
              icon="pi pi-print"
              className="flex-1"
              onClick={() => {
                // Add print functionality
                window.print();
              }}
            />
            <Button
              label="Share Order"
              icon="pi pi-share-alt"
              severity="secondary"
              className="flex-1"
              onClick={() => {
                // Add share functionality
                if (navigator.share) {
                  navigator.share({
                    title: `Order ${selectedOrder.orderNumber}`,
                    text: `Order total: $${selectedOrder.totalAmount.toFixed(
                      2
                    )}`,
                    url: window.location.href,
                  });
                } else {
                  toast.info("Share feature not supported on this device");
                }
              }}
            />
            <Button
              label="Close"
              icon="pi pi-times"
              severity="danger"
              outlined
              onClick={() => setSelectedOrder(null)}
            />
          </div>
        </div>
      )}
    </Dialog>
  );

  return (
    <>
      <Dialog
        header={
          <div className="flex items-center space-x-3">
            <i className="pi pi-list-check text-2xl text-blue-600"></i>
            <div>
              <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
              <p className="text-sm text-gray-600">Track your order history</p>
            </div>
          </div>
        }
        visible={visible}
        style={{ width: "95vw", maxWidth: "1000px" }}
        onHide={onHide}
        maximizable
      >
        <div className="space-y-4">
          {orders.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <i className="pi pi-shopping-bag text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      You have{" "}
                      <span className="font-bold text-blue-600">
                        {orders.length}
                      </span>{" "}
                      order{orders.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total spent: $
                      {orders
                        .reduce((total, order) => total + order.totalAmount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Total saved: $
                    {orders
                      .reduce((total, order) => total + order.totalSavings, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
                {orders.map((order) => (
                  <Card
                    key={order.orderId}
                    className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500 hover:border-l-blue-600"
                    onClick={() => setSelectedOrder(order)}
                    pt={{
                      body: { className: "p-4" },
                      content: { className: "p-0" },
                    }}
                  >
                    <div className="space-y-3">
                      {/* Order Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <i className="pi pi-receipt text-blue-600"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">
                              {order.orderNumber}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          value={getStatusText(order.status)}
                          severity={getStatusColor(order.status)}
                          className="text-sm px-3 py-1"
                        />
                      </div>

                      {/* Order Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Items</p>
                          <p className="font-bold text-blue-600">
                            {order.items.length}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-semibold text-gray-800 truncate">
                            {order.customerInfo.name}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-bold text-green-600 text-lg">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quick Items Preview */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">
                          Order Items:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <Chip
                              key={index}
                              label={`${item.nameEn || item.name} (${
                                item.quantity
                              }x)`}
                              className="bg-blue-100 text-blue-800 text-xs"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <Chip
                              label={`+${order.items.length - 3} more`}
                              className="bg-gray-100 text-gray-600 text-xs"
                            />
                          )}
                        </div>
                      </div>

                      {/* Savings Badge */}
                      {order.totalSavings > 0 && (
                        <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2">
                            <i className="pi pi-tag text-green-600"></i>
                            <span className="text-sm font-semibold text-green-700">
                              You saved ${order.totalSavings.toFixed(2)}
                            </span>
                          </div>
                          <Chip
                            label={`${(
                              (order.totalSavings / order.originalAmount) *
                              100
                            ).toFixed(1)}% OFF`}
                            className="bg-green-100 text-green-700 text-xs"
                          />
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <Button
                          label="View Full Details"
                          icon="pi pi-eye"
                          className="p-button-sm p-button-text p-button-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        />
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <i className="pi pi-clock"></i>
                          <span>
                            {order.estimatedDeliveryTime
                              ? `Estimated: ${formatDate(
                                  order.estimatedDeliveryTime
                                )}`
                              : "Processing..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <i className="pi pi-shopping-cart text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                No Orders Yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Your order history will appear here once you place your first
                order. Start browsing our menu to create your first order!
              </p>
              <Button
                label="Browse Menu"
                icon="pi pi-search"
                className="p-button-lg"
                onClick={onHide}
              />
            </div>
          )}
        </div>
      </Dialog>

      <OrderDetailDialog />
    </>
  );
};

export default MyOrders;
