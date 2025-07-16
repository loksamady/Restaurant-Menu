import {
  CreateVendorSchemaType,
  UpdateVendorSchemaType,
} from "@src/validationType/vendor";
import { create } from "zustand";

type VendorState = {
  formData: CreateVendorSchemaType | UpdateVendorSchemaType;
  setFormData: (
    formData: Partial<CreateVendorSchemaType | UpdateVendorSchemaType>
  ) => void;
  resetFormData: () => void;
};

export const defaultValues: CreateVendorSchemaType | UpdateVendorSchemaType = {
  name: "",
  period: 0,
  price: 0,
  discount: 0,
  merchantLimit: 0,
  status: true,
  username: "",
  userPassword: "",
  userRoles: [4],
};

export const useVendorStore = create<VendorState>((set) => ({
  formData: defaultValues,
  setFormData: (partial) => {
    set((state) => ({ formData: { ...state.formData, ...partial } }));
  },
  resetFormData: () => set({ formData: defaultValues }),
}));
