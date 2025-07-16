import { Button } from "primereact/button";
import { UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import { UpdateUserSchemaType } from "@src/validationType/user";
import { useRoleStore } from "@src/state/role";
import FormMultiSelect from "@src/components/Form/FormMultiSelect";
// import FormDropdown from "@src/components/Form/FormDropdown";
// import { useMerchantStore } from "@src/state/merchant";
// import useAuth from "@src/hooks/useAuth";
import FormPassword from "@src/components/Form/FormPassword";
import { ROLE } from "@src/enum/role";

type Props = {
  form: UseFormReturn<UpdateUserSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: UpdateUserSchemaType) => void;
  ownerOnly?: boolean;
};

const UpdateUserForm = ({
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
        />
        <FormPassword
          name="password"
          placeholder="Password"
          title="Password"
          control={form.control}
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
              options={merchantOptions || []}
              showClear
              control={form.control}
            />
          </div>
        )} */}
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
