import { CategoryOptionType } from "@src/types/category";
import { create } from "zustand";

type CategoryState = {
  options: CategoryOptionType[];
  setOptions: (options: CategoryOptionType[]) => void;
  clearOptions: () => void;
};

export const useCategoryStore = create<CategoryState>((set) => ({
  options: [],
  setOptions: (options: CategoryOptionType[]) =>
    set(() => ({ options: options })),
  clearOptions: () => set({ options: [] }),
}));
