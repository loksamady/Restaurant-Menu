import {
  MerchantSchemaType,
  MerchantThemeSchemaType,
} from "@src/validationType/merchant";
import { SelectItemOptionsType } from "primereact/selectitem";
import { create } from "zustand";

type MerchantState = {
  options: SelectItemOptionsType;
  setOptions: (options: SelectItemOptionsType) => void;
  clearOptions: () => void;
  themeFormData: MerchantThemeSchemaType;
  setThemeFormData: (themeFormData: Partial<MerchantThemeSchemaType>) => void;
  resetThemeFormData: () => void;
  formData: MerchantSchemaType;
  setFormData: (formData: Partial<MerchantSchemaType>) => void;
  resetFormData: () => void;
};

export const defaultThemeValues: MerchantThemeSchemaType = {
  primary: "",
  primaryLight: "",
  primaryDark: "",
  secondary: "",
  secondaryLight: "",
  secondaryDark: "",
};

export const defaultValues: MerchantSchemaType = {
  name: "",
  primaryPhone: "",
  secondaryPhone: "",
  titleEn: "",
  titleKh: "",
  titleCn: "",
  subtitleEn: "",
  subtitleKh: "",
  subtitleCn: "",
  descriptionEn: "",
  descriptionKh: "",
  descriptionCn: "",
  address: "",
  location: "",
  openTime: "",
  closeTime: "",
  slug: "",
  telegram: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  logo: [],
  banners: [],
  active: true,
};

export const useMerchantStore = create<MerchantState>((set) => ({
  options: [],
  setOptions: (options: SelectItemOptionsType) =>
    set(() => ({ options: options })),
  clearOptions: () => set({ options: [] }),
  themeFormData: defaultThemeValues,
  setThemeFormData: (partial) => {
    set((state) => ({ themeFormData: { ...state.themeFormData, ...partial } }));
  },
  resetThemeFormData: () => set({ themeFormData: defaultThemeValues }),
  formData: defaultValues,
  setFormData: (partial) => {
    set((state) => ({ formData: { ...state.formData, ...partial } }));
  },
  resetFormData: () => set({ formData: defaultValues }),
}));
