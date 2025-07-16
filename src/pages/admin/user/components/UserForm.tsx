import { Button } from "primereact/button";
import { UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import { CreateUserSchemaType } from "@src/validationType/user";
import { useRoleStore } from "@src/state/role";
import FormMultiSelect from "@src/components/Form/FormMultiSelect";
// import { useMerchantStore } from "@src/state/merchant";
import FormPassword from "@src/components/Form/FormPassword";
import { ROLE } from "@src/enum/role";
import { useEffect } from "react";

type Props = {
  form: UseFormReturn<CreateUserSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: CreateUserSchemaType) => void;
  ownerOnly?: boolean;
};

const UserForm = ({
  form,
  isLoading,
  handleSubmit,
  ownerOnly = false,
}: Props) => {
  const { options: roleOptions } = useRoleStore();
  // const { options: merchantOptions } = useMerchantStore();

  const mappedRoleOptions = roleOptions.filter((role) => {
    return ownerOnly ? role?.label === ROLE.OWNER : role?.label !== ROLE.OWNER;
  });

  useEffect(() => {
    ownerOnly && form.setValue("roles", [4]);
  }, [ownerOnly]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid grid-cols-2 gap-3 items-center">
        <FormInput
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
        <div className="md:col-span-2">
          <FormMultiSelect
            name="roles"
            control={form.control}
            value={form.watch("roles")}
            options={mappedRoleOptions || []}
            title="Roles"
            filter
            showClear
            required
            placeholder="Select Roles"
            onChange={(e) => form.setValue("roles", e.target.value)}
          />
        </div>
        {/* {isOwner() && (
          <div className="md:col-span-2">
            <FormDropdown
              name="merchantId"
              title="Merchant"
              placeholder="Select a Merchant"
              showClear
              options={merchantOptions || []}
              control={form.control}
            />
          </div>
        )} */}
      </div>

      <div className="w-full">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label={"Create"}
          size="small"
          type="submit"
          className="h-10 w-full"
          onClick={() => form.handleSubmit(handleSubmit)}
        />
      </div>
    </form>
  );
};

export default UserForm;
