import Logo from "@src/assets/Logo/Logo.png";
import LngLink from "@src/components/LngLink";
import Nav from "./components/navBar/Nav";
import { PageType } from "@src/types/page";
import usePageStore from "@src/state/page";
import SiteMapDialog from "./components/siteMap/SiteMapDialog";
import { useState, useMemo } from "react";
import useUrlLng from "@src/hooks/useUrlLng";
import { NavMenuType } from "@src/types/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { lang } = useUrlLng();
  const [siteMapDialogVisible, setSiteMapDialogVisible] =
    useState<boolean>(false);
  const { pages } = usePageStore();

  const mapPagesToMenuItems = (
    pages: PageType[],
    level: number,
    parentPage?: PageType
  ): NavMenuType[] => {
    if (level === 2) {
      const pagesNoChild = pages.filter((page) => page.childPages.length === 0);

      const categoryMenuItem = {
        label:
          (lang === "kh" ? parentPage?.titleKh : parentPage?.titleEn) || "",
        items: mapPages(pagesNoChild, level),
      };

      const pagesWithChild = pages.filter((page) => page.childPages.length > 0);
      const menuItemsWithChild = mapPages(pagesWithChild, level);
      const menuItems = [categoryMenuItem, ...menuItemsWithChild];

      return menuItems;
    }

    return mapPages(pages, level);
  };

  function mapPages(pages: PageType[], level: number): NavMenuType[] {
    return pages.map((page) => {
      const label = (lang === "kh" ? page.titleKh : page.titleEn) || "";

      let url: string | undefined;
      let isOutSourceUrl: boolean = false;

      if (page.url) {
        url = page.url!;
        isOutSourceUrl = true;
      } else if (page.path) {
        url = `/${lang}${page.path!}`;
      } else {
        url = undefined;
      }

      const items =
        page.childPages && page.childPages.length > 0
          ? mapPagesToMenuItems(page.childPages, level + 1, page).filter(
              (item) => item.items?.length != 0
            )
          : undefined;

      const menu: NavMenuType = {
        id: page.id.toString(),
        label,
        items,
        url,
        isOutSourceUrl,
      };

      return menu;
    });
  }

  // Memoize items to avoid recalculating when not necessary
  const items: NavMenuType[] = useMemo(
    () => [
      { id: "home", url: `/${lang}`, label: "Home" },
      ...mapPagesToMenuItems(pages, 1),
    ],
    [pages, lang]
  );

  return (
    <div className="sticky top-0 shadow-sm bg-white z-50 px-3">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between py-2">
        <LngLink to={""}>
          <img src={Logo} className="w-24" />
        </LngLink>
        <div className="flex items-center gap-8">
          <Nav menuItems={items} />
          <div className="hidden md:block">
            <FontAwesomeIcon
              icon={faSitemap}
              onClick={() => setSiteMapDialogVisible(true)}
              className="text-xl h-5 w-5"
            />
            <SiteMapDialog
              items={items}
              visible={siteMapDialogVisible}
              setVisible={setSiteMapDialogVisible}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
