import { CartMenuType } from "@src/types/cartMenu";
import { MenuType } from "@src/types/website";
import { StateCreator } from "zustand";

type CartState = {
  menus: CartMenuType[];
  total: number;
};
type CartAction = {
  addMenu: (menu: MenuType, quantity: number) => void;
  removeMenu: (menuId: string) => void;
  increaseQuantity: (menuId: string) => void;
  decreaseQuantity: (menuId: string) => void;
  getMenuById: (menuId: string) => CartMenuType | undefined;
  setTotal: (total: number) => void;
  clearCart: () => void;
};

export type CartSliceType = CartState & CartAction;

const initialState: CartState = {
  menus: [],
  total: 0,
};

export const createCartSliceType: StateCreator<
  CartSliceType,
  [["zustand/devtools", never]],
  []
> = (set, get) => ({
  ...initialState,
  increaseQuantity: (menuId: string) =>
    set((state: CartState) => {
      const foundMenu = state.menus.find(
        (menu) => menu.menu.menuId.toString() === menuId
      );
      if (foundMenu) {
        return {
          ...state,
          menus: state.menus.map((menu) =>
            menu.menu.menuId.toString() === menuId
              ? { ...menu, quantity: menu.quantity + 1 }
              : menu
          ),
        };
      }
      return state;
    }),
  decreaseQuantity: (menuId: string) =>
    set((state: CartState) => {
      const foundIndex = state.menus.findIndex(
        (menu) => menu.menu.menuId.toString() === menuId
      );
      if (foundIndex !== -1) {
        const foundMenu = state.menus[foundIndex];
        if (foundMenu.quantity > 1) {
          return {
            ...state,
            menus: state.menus.map((menu) =>
              menu.menu.menuId.toString() === menuId
                ? { ...menu, quantity: menu.quantity - 1 }
                : menu
            ),
          };
        } else {
          return {
            ...state,
            menus: state.menus.filter(
              (menu) => menu.menu.menuId.toString() !== menuId
            ),
          };
        }
      }
      return state;
    }),
  addMenu: (menu: MenuType, quantity: number) =>
    set((state: CartState) => {
      const filteredMenus = state.menus.filter(
        (m) => m.menu.menuId.toString() !== menu.menuId.toString()
      );
      return {
        ...state,
        menus: [...filteredMenus, { menu, quantity }],
      };
    }),
  removeMenu: (menuId: string) =>
    set((state: CartState) => ({
      ...state,
      menus: state.menus.filter(
        (menu) => menu.menu.menuId.toString() !== menuId
      ),
    })),
  getMenuById: (menuId: string) => {
    const state = get();
    return state.menus.find(
      (menu: CartMenuType) => menu.menu.menuId.toString() === menuId
    );
  },
  setTotal: (total: number) => set((state: CartState) => ({ ...state, total })),
  clearCart: () => set(() => ({ ...initialState })),
});
