import { CreateCustomerSchemaType } from "./validation";
import { registerCustomer as registerCustomerApi } from "@src/api/service/site/customerRegistration.service";

export async function registerCustomer(
  data: CreateCustomerSchemaType & {
    first_name?: string;
    telegramId?: number;
    telegramUsername?: string;
    profilePicture?: string;
  }
) {
  return registerCustomerApi(data);
}
