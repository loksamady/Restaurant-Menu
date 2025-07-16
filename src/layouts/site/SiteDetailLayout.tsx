import { Outlet, useLocation } from "react-router-dom";
import "./style.css";
import SiteDetailHeader from "@src/components/SiteDetailHeader";
import React, { useEffect, useState } from "react";
import { PageType } from "@src/types/page";
import { useTranslation } from "react-i18next";
import useUrlLang from "@src/hooks/useUrlLng";
import usePageStore from "@src/state/page";
import useExtandedMenu from "@src/hooks/useExtandedMenu";
import SiteDetailMainPageTitle from "./components/SiteDetailMainPage";
import SiteDetailMenu from "./components/SiteDetailMenu";
import ConsultingSection from "@src/components/ConsultingSection";
import { NavMenuType } from "@src/types/menu";

const SiteDetailLayout = React.memo(() => {
  const lang = useUrlLang();
  const { i18n } = useTranslation();
  const [items, setItems] = useState<NavMenuType[]>([]);
  const [page, setPage] = useState<NavMenuType>();
  const [parentPage, setParentPage] = useState<PageType>();
  const { pages: globalPages } = usePageStore();
  const location = useLocation();
  const { getExtandedMenus } = useExtandedMenu();

  const mapPagesToMenuItems = (pages: PageType[]): NavMenuType[] => {
    const mappedItems = pages.map((page) => {
      let items: NavMenuType[] | undefined;
      items = mapPagesToMenuItems(page.childPages);
      let url: string | undefined;
      url = `/${lang.lang}${page.path}` ?? undefined;
      const menu: NavMenuType = {
        id: page.id.toString(),
        label: (i18n.language === "kh" ? page.titleKh : page.titleEn) || "",
        items,
        url: page.url ? page.url : url,
        isOutSourceUrl: page.url ? true : false,
      };
      return menu;
    });

    return mappedItems;
  };

  const getMenuItems = async () => {
    const parentPath = "/" + location.pathname.split("/").slice(2, 3).join("/");
    const parentPage = globalPages.find((page) => page.path === parentPath);
    setParentPage(parentPage);
    const menus = mapPagesToMenuItems(parentPage?.childPages || []);
    setItems(menus);
  };

  const findCurrentPage = (
    pages: NavMenuType[],
    level: number
  ): NavMenuType | undefined => {
    for (const page of pages) {
      const dynamicPathArray = location.pathname.split("/");
      dynamicPathArray.pop();
      const dynamicPath = dynamicPathArray.join("/");
      // CHECK IF PAGE EQUAL CURRENT ROUTE OR DYNAMIC ROUTE RETURN PAGE
      if (
        page.url === location.pathname ||
        (page.url === dynamicPath && page.items === undefined)
      ) {
        return page;
      }
      // IF PAGE NOT FOUND CHECK PAGE ITEMS
      if (page.items && page.items.length > 0) {
        const flattenedItems = page.items.flat();
        const foundPage = findCurrentPage(flattenedItems, level + 1);
        if (foundPage) {
          return foundPage;
        }
      }
    }
    return undefined;
  };

  const getCurrentPageTitle = (items: NavMenuType[]) => {
    const page = findCurrentPage(items, 1);
    setPage(page);
  };

  /// GET MENU ITEMS
  useEffect(() => {
    if (location.pathname) {
      if (globalPages.length > 0) {
        getMenuItems();
      } else {
        setItems([]);
      }
    }
  }, [
    location.pathname,
    globalPages,
    setItems,
    i18n.language,
    getExtandedMenus,
  ]);

  /// GET CURRENT PAGE TITLE
  useEffect(() => {
    if (items.length > 0) getCurrentPageTitle(items);
  }, [items, location.pathname]);

  const title =
    page?.label ||
    (i18n.language === "kh" ? parentPage?.titleKh : parentPage?.titleEn) ||
    "";

  return (
    <div>
      {location.pathname !== `/${lang.lang}/contact` && <ConsultingSection />}
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-4 py-2 gap-6">
        {items.length > 0 && (
          <div className="hidden md:block sticky top-16 left-0 max-h-[82vh] overflow-y-auto">
            <SiteDetailMainPageTitle title={parentPage?.titleEn || ""} />
            <SiteDetailMenu items={items} />
          </div>
        )}
        <div
          className={`${
            items.length > 0 ? "col-span-3" : "col-span-4"
          } min-h-[78vh]`}
        >
          <SiteDetailHeader title={title} />
          <div className="px-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
});

export default SiteDetailLayout;
