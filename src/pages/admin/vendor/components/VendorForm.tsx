/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "primereact/button";
import { UseFormReturn } from "react-hook-form";
import FormInput from "@src/components/Form/FormInput";
import FormCheckbox from "@src/components/Form/FormCheckbox";
import FormInputNumber from "@src/components/Form/FormInputNumber";
import FormMultiSelect from "@src/components/Form/FormMultiSelect";
import { ROLE } from "@src/enum/role";
import FormPassword from "@src/components/Form/FormPassword";

type Props = {
  id?: number;
  form: UseFormReturn<any>;
  isLoading: boolean;
  handleSubmit: (data: any) => void;
};

const VendorForm = ({ id, form, isLoading, handleSubmit }: Props) => {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <FormInput
          name="name"
          placeholder="Name"
          title="Name"
          control={form.control}
          required
        />
        <FormInputNumber
          name="merchantLimit"
          title="Merchant Limit"
          control={form.control}
          required
        />
        <FormCheckbox
          name="status"
          title="Status"
          label="Active"
          control={form.control}
        />
      </div>

      <div>
        <div className="font-semibold mb-2">User Information</div>
        <div className="border p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <FormInput
            name="username"
            placeholder="Username"
            title="Username"
            control={form.control}
            disabled={!!id}
            readOnly={!!id}
            required
          />
          <FormPassword
            name="userPassword"
            placeholder="Password"
            title="User Password"
            control={form.control}
            required={!id}
          />
          <div className="md:col-span-2">
            <FormMultiSelect
              name="userRoles"
              control={form.control}
              title="User Roles"
              options={[{ roleId: 4, name: ROLE.OWNER }]}
              optionLabel="name"
              optionValue="roleId"
              disabled
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label={id ? "Update" : "Create"}
          size="small"
          type="submit"
          className="h-10 w-full"
          onClick={() => form.handleSubmit(handleSubmit)}
        />
      </div>
    </form>
  );
};

export default VendorForm;
