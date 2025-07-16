import { Button } from "primereact/button";
import { UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import { UpdateAuthSchemaType } from "@src/validationType/user";
import FormPassword from "@src/components/Form/FormPassword";

type Props = {
  form: UseFormReturn<UpdateAuthSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: UpdateAuthSchemaType) => void;
};

const UpdateUserForm = ({ form, isLoading, handleSubmit }: Props) => {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid grid-cols-2 gap-3 items-center">
        <FormInput
          disabled
          name="username"
          placeholder="Username"
          title="Username"
          control={form.control}
          required
        />
        <FormPassword
          name="password"
          placeholder="Password"
          title="Password"
          control={form.control}
          required
        />
      </div>
      <div className="w-full">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label={"Update"}
          size="small"
          type="submit"
          className="h-10 w-full"
          onClick={() => form.handleSubmit(handleSubmit)}
        />
      </div>
    </form>
  );
};

export default UpdateUserForm;
