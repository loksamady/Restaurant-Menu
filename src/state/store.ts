import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { CartSliceType, createCartSliceType } from "./cart-slice";

export const userStore = create<CartSliceType>()(
  immer((...a) => ({
    ...createCartSliceType(...a),
  }))
);
