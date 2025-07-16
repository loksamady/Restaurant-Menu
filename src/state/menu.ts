import { CustomRouteObject } from "@src/types/route";
import { create } from "zustand";

type MenuState = {
  activeMenu: CustomRouteObject | null;
  setActiveMenu: (activeMenu: CustomRouteObject | null) => void;
};

const useMenuStore = create<MenuState>((set) => ({
  activeMenu: null,
  setActiveMenu: (activeMenu: CustomRouteObject | null) => set({ activeMenu }),
}));

export default useMenuStore;
