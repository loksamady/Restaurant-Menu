import { CreateCustomerSchemaType } from "./validation";
import { CUSTOMER_REGISTER_ENDPOINT } from "@src/constant/site/constant";

export async function registerCustomer(
  data: CreateCustomerSchemaType
) {
  const response = await fetch(CUSTOMER_REGISTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
