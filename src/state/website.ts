import { MerchantThemeType } from "@src/types/admin/merchant";
import { CategoryType, MenuType, MerchantType } from "@src/types/website";
import { create } from "zustand";
// Zustand store for managing website state
type WebsiteState = {
  merchant: MerchantType | null;
  merchantTheme: MerchantThemeType | null;
  categories: CategoryType[];
  menus: MenuType[];
  setMerchant: (merchant: MerchantType | null) => void;
  setMerchantTheme: (merchantTheme: MerchantThemeType | null) => void;
  setCategories: (categories: CategoryType[]) => void;
  setMenus: (menus: MenuType[]) => void;
};
// Zustand store for managing website state
export const useWebsiteStore = create<WebsiteState>((set) => ({
  merchant: null,
  merchantTheme: null,
  categories: [],
  menus: [],
  setMerchant: (merchant) => set({ merchant: merchant }),
  setMerchantTheme: (merchantTheme) => set({ merchantTheme: merchantTheme }),
  setCategories: (categories) => set({ categories: categories }),
  setMenus: (menus) => set({ menus: menus }),
}));
