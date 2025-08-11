import { ORDER_ENDPOINT } from "@src/constant/site/constant";
import { post } from "../../config";
import { toastPromise } from "@src/util/toastUtil";
import { CreateOrderSchemaType } from "@src/validationType/customer";

export const createOrder = async (orderData: CreateOrderSchemaType) => {
  const data = await post<CreateOrderSchemaType>(ORDER_ENDPOINT, orderData);

  if (data) toastPromise(data, "Order has been created", true);

  return await data;
};
