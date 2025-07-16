import { ROLE } from "@src/enum/role";

export interface CustomRouteObject {
  path: string;
  element?: JSX.Element;
  label?: string;
  icon?: JSX.Element;
  children?: CustomRouteObject[];
  roles?: ROLE[];
  active?: boolean;
}
