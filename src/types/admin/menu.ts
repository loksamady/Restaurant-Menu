import { ReactNode } from "react";

export type AdminMenuItem = {
  name: string;
  label: string;
  icon: ReactNode;
  command: () => void;
};
