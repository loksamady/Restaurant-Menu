import { PageType } from "@src/types/page";
import { useCallback } from "react";

const useExtandedMenu = () => {
  const getExtandedMenus = useCallback((page: PageType): PageType[] => {
    switch (page.path) {
      default:
        return [];
    }
  }, []);

  return { getExtandedMenus };
};

export default useExtandedMenu;
