import { useEffect, useMemo, useState } from "react";
import HomeHeader from "./components/HomeHeader";
import HomeHero from "./components/HomeHero";
import HomeMainSection from "./components/HomeMainSection";
import { useQuery } from "@tanstack/react-query";
import HomeFooter from "./components/HomeFooter";
import SearchMenuSection from "./components/SearchMenuSection";
import { useParams } from "react-router-dom";
import { getWebsiteData } from "@src/api/service/website.service";
import { MenuType, WebsiteTypeResponse } from "@src/types/website";
import { useWebsiteStore } from "@src/state/website";
import NotFound from "@src/components/Error/NotFound";
import Loading from "@src/components/Loading";

const HomePage: React.FC = () => {
  const { slug } = useParams() as { slug: string };
  const { setMerchant, setMerchantTheme, setCategories, setMenus } =
    useWebsiteStore();

  const [searchMenu, setSearchMenu] = useState<string>("");

  const {
    data: websiteData,
    isError,
    isLoading,
  } = useQuery<WebsiteTypeResponse>({
    queryKey: ["website-data"],
    queryFn: () => getWebsiteData(slug),
  });

  const filteredMenu: MenuType[] = useMemo(() => {
    if (!websiteData?.data?.menus) return [];

    return websiteData?.data?.menus.filter(
      (item: MenuType) =>
        (item.nameEn &&
          item.nameEn.toLowerCase().includes(searchMenu.toLowerCase())) ||
        (item.code &&
          item.code.toLowerCase().includes(searchMenu.toLowerCase()))
    );
  }, [websiteData?.data?.menus, searchMenu]);

  // ...existing code...
  useEffect(() => {
    if (websiteData?.data) {
      setMerchant(websiteData.data.merchant || null);
      setMerchantTheme(websiteData.data.merchantTheme || null);
      setCategories(websiteData.data.categories || []);
      setMenus(websiteData.data.menus || []);
    }
  }, [websiteData]);
  // ...existing code...

  if (isLoading) return <Loading />;

  if (isError) return <NotFound />;

  return (
    <div
      id="top"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50"
    >
      <HomeHeader
        value={searchMenu}
        onSearchChange={(value: string) => setSearchMenu(value)}
      />
      <HomeHero />
      {searchMenu == "" ? (
        <HomeMainSection />
      ) : (
        <SearchMenuSection menus={filteredMenu} />
      )}
      <HomeFooter />
    </div>
  );
};

export default HomePage;
