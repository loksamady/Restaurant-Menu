import { orderStore } from "@src/state/order";
import { Order } from "@src/types/order";

// Test function to verify order functionality
export const testOrderFunctionality = () => {
  const { addOrder, addValidCustomer, isValidCustomer, getValidCustomer } =
    orderStore.getState();

  console.log("🧪 Testing Order Functionality...");

  // Test 1: Add a valid customer
  const testCustomer = {
    name: "John Doe",
    phone: "+1234567890",
    email: "john@example.com",
    address: "123 Test Street",
    notes: "",
    paymentMethod: "cash" as const,
  };

  addValidCustomer(testCustomer);
  console.log("✅ Added valid customer:", testCustomer);

  // Test 2: Check if customer is valid
  const isValid = isValidCustomer("+1234567890", "John Doe");
  console.log("✅ Customer validation result:", isValid);

  // Test 3: Get customer info
  const retrievedCustomer = getValidCustomer("+1234567890");
  console.log("✅ Retrieved customer:", retrievedCustomer);

  // Test 4: Create a test order
  const testOrder: Order = {
    orderId: "test_order_123",
    orderNumber: "ORD-20250806-0001",
    orderDate: new Date().toISOString(),
    status: "pending",
    items: [
      {
        menuId: 1,
        name: "Test Burger",
        nameEn: "Test Burger",
        quantity: 2,
        price: 15.99,
        originalPrice: 17.99,
        discount: 10,
        image: "burger.jpg",
      },
    ],
    customerInfo: testCustomer,
    totalAmount: 31.98,
    originalAmount: 35.98,
    totalSavings: 4.0,
    deliveryAddress: testCustomer.address,
    specialInstructions: "Extra sauce please",
    submittedToApi: false,
  };

  addOrder(testOrder);
  console.log("✅ Added test order:", testOrder);

  // Test 5: Verify order was added
  const allOrders = orderStore.getState().orders;
  console.log("✅ Total orders in store:", allOrders.length);
  console.log("✅ Latest order:", allOrders[0]);

  console.log("🎉 Order functionality test completed!");

  return {
    success: true,
    ordersCount: allOrders.length,
    validCustomersCount: orderStore.getState().validCustomers.length,
  };
};
