import { create } from "zustand";

type WidowType = { width: number; height: number };

type WindowState = {
  window: WidowType;
  setWindow: (window: WidowType) => void;
};

const useWindowStore = create<WindowState>((set) => ({
  window: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  setWindow: (window) => set({ window }),
}));

export default useWindowStore;
