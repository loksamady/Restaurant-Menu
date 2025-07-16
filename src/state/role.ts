import { SelectItemOptionsType } from "primereact/selectitem";
import { create } from "zustand";

type RoleState = {
  options: SelectItemOptionsType;
  setOptions: (options: SelectItemOptionsType) => void;
  clearOptions: () => void;
};

export const useRoleStore = create<RoleState>((set) => ({
  options: [],
  setOptions: (options: SelectItemOptionsType) =>
    set(() => ({ options: options })),
  clearOptions: () => set({ options: [] }),
}));
