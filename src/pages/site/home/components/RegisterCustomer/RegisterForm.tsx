import { Button } from "primereact/button";
import { UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import { CreateCustomerSchemaType } from "@src/validationType/customer";
import { registerCustomer } from "@src/api/service/site/customerRegistration.service"; // import API

type Props = {
  form: UseFormReturn<CreateCustomerSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: CreateCustomerSchemaType) => void;
};

const RegisterForm = ({ form, isLoading, handleSubmit }: Props) => {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid w-96 gap-4">
        <FormInput
          name="username"
          placeholder="Username"
          title="Username"
          control={form.control}
          required
        />
        <FormInput
          name="telegram_id"
          placeholder="Telegram ID"
          title="Telegram ID"
          control={form.control}
        />
        <FormInput
          name="telegram_username"
          placeholder="Telegram Username"
          title="Telegram Username"
          control={form.control}
        />
        <FormInput
          name="phone_number"
          placeholder="Phone Number"
          title="Phone Number"
          control={form.control}
          required
        />
      </div>

      <div className="w-full">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label={"Create"}
          size="small"
          type="submit"
          className="h-10 w-full"
          onClick={async (e) => {
            e.preventDefault();
            const values = form.getValues();
            console.log("Create button clicked, FormInput values:", values); // log values
            try {
              await registerCustomer(values); // call API
              console.log("Customer registered to API:", values);
            } catch (error) {
              console.error("API error:", error);
            }
            form.handleSubmit(handleSubmit)();
          }}
        />
      </div>
    </form>
  );
};

export default RegisterForm;
