import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { CartSliceType, createCartSliceType } from "./cart-slice";

export const userStore = create<CartSliceType>()(
  devtools(
    persist(
      immer((...a) => createCartSliceType(...a)),
      {
        name: "cart-storage",
        partialize: (state) => ({
          menus: state.menus,
          total: state.total,
        }),
        version: 1,
      }
    )
  )
);
