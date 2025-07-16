import { Clock, MapPin, Phone } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { useEffect, useState } from "react";
import LanguageToggle from "@src/components/LanguageSwitcher";
import useUrlLng from "@src/hooks/useUrlLng";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import {
  displayPhoneNumber,
  formatPhoneToTelLink,
} from "@src/util/phoneNumberUtil";
import { useWebsiteStore } from "@src/state/website";
import { CHINESE, KHMER } from "@src/constant/site/constant";
import SocialMedia from "./SocialMedia";
import { CategoryType } from "@src/types/website";
import { getTextColor } from "@src/util/themeColorUtil";
import { IMAGE_URL } from "@src/constant/env";
import ShoppingCart from "./ShoppingCart";
import ShowCart from "./ShowCart";

type Props = {
  value: string;
  onSearchChange?: (value: string) => void;
};

const HomeHeader = ({ value, onSearchChange }: Props) => {
  const { lang } = useUrlLng();
  const { t } = useTranslation("site");
  const { merchant, merchantTheme, categories, menus } = useWebsiteStore();

  // Cart state and type
  type CartItem = {
    name: string;
    qty: number;
    price: number;
    image?: string;
  };

  const mappedCategories = () => {
    return categories.filter((category) => {
      const categoryMenus = menus.filter((menu) =>
        menu.categories.some((c) => c?.categoryId === category?.categoryId)
      );

      return (
        categoryMenus &&
        categoryMenus.length > 0 && { ...category, menus: categoryMenus }
      );
    });
  };

  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const getCategoryName = (category: CategoryType) => {
    return lang === CHINESE
      ? category?.nameCn
      : lang === KHMER
      ? category?.nameKh
      : category?.nameEn;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250; // Offset for header height

      // Find which category section is currently in view
      for (const category of categories) {
        const element = document.getElementById(
          `${merchant?.slug}/category-${category.categoryId}`
        );

        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveCategory(category.categoryId);
            break;
          }
        }
      }
    };

    // Set initial active category
    if (categories.length > 0) setActiveCategory(categories[0].categoryId);

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Call once to set initial state
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Restaurant Info */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link to="top" smooth duration={500} className="cursor-pointer">
              <Avatar
                label={merchant?.name?.charAt(0) ?? "D"}
                image={
                  merchant?.logo
                    ? `${IMAGE_URL}/merchant_logos/${merchant?.logo}`
                    : undefined
                }
                size="xlarge"
                shape="circle"
                className="w-12 h-12 font-bold text-2xl shadow-sm uppercase"
                style={{
                  backgroundColor: `#${
                    merchant?.logo ? "#ffffff" : merchantTheme?.primary
                  }`,
                  color:
                    merchantTheme?.primary &&
                    getTextColor(merchantTheme?.primary),
                }}
              />
            </Link>

            <div>
              <p className="text-xl font-bold text-gray-800">
                {merchant?.name || "DevSphere"}
              </p>

              <div className="items-center space-x-4 font-medium text-sm text-gray-600 hidden lg:flex">
                {merchant?.address && (
                  <div className="flex items-center space-x-1 group transform duration-300">
                    <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                    <RouterLink
                      to={merchant?.location || "#"}
                      target={merchant?.location && "_blank"}
                      className="hover:text-blue-600 hover:underline transform duration-300"
                    >
                      {merchant?.address}
                    </RouterLink>
                  </div>
                )}

                {merchant?.primaryPhone && (
                  <div className="flex items-center space-x-1 group">
                    <Phone className="w-4 h-4 group-hover:animate-wiggle" />
                    <RouterLink
                      to={formatPhoneToTelLink(merchant?.primaryPhone)}
                      className="hover:text-blue-600 hover:underline transform duration-300"
                    >
                      {displayPhoneNumber(merchant?.primaryPhone)}
                    </RouterLink>
                    {merchant?.secondaryPhone && (
                      <span>
                        {" "}
                        |{" "}
                        <RouterLink
                          to={formatPhoneToTelLink(merchant?.secondaryPhone)}
                          className="hover:text-blue-600 hover:underline transform duration-300"
                        >
                          {displayPhoneNumber(merchant?.secondaryPhone)}
                        </RouterLink>
                      </span>
                    )}
                  </div>
                )}

                {/* <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    #D21, Street. 28, Sangkat Toulsangkae II, Khan Russeykeo,
                    Phnom Penh.
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <RouterLink to={formatPhoneToTelLink("85577222063")}>
                    {displayPhoneNumber("85577222063")}
                  </RouterLink>
                </div> */}

                {merchant?.openTime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      Open {merchant?.openTime} - {merchant?.closeTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="items-center space-x-3 justify-end flex">
            {/* <ShowCart /> */}
            <ShoppingCart />
            <div className="hidden lg:block justify-end">
              <SocialMedia />
            </div>

            <LanguageToggle />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              type="text"
              placeholder={t("searchForMenus")}
              className="w-full rounded-full"
              value={value}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
            {value && (
              <InputIcon
                className="pi pi-times absolute right-5 text-gray-500 hover:cursor-pointer"
                onClick={() => onSearchChange && onSearchChange("")}
              />
            )}
          </IconField>
        </div>

        {/* Category Navigation */}
        {mappedCategories() && mappedCategories().length > 0 && (
          <ScrollPanel className="mt-4 w-full h-14 md:h-10">
            <div className="flex flex-nowrap gap-2 pr-20 w-full">
              {mappedCategories().map((category: CategoryType) => (
                <Link
                  key={category.categoryId}
                  to={`${merchant?.slug}/category-${category.categoryId}`}
                  smooth
                  duration={300}
                  offset={-220}
                  className={`cursor-pointer flex items-center space-x-5 px-4 py-1.5 rounded-full font-semibold transition-all duration-200 whitespace-nowrap
                    ${
                      activeCategory === category?.categoryId
                        ? "bg-gray-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:!bg-[color:var(--hover-backgroundColor)] hover:!text-[color:var(--hover-color)]"
                    }
                    `}
                  style={
                    {
                      "--hover-color": getTextColor(
                        merchantTheme?.primary
                          ? merchantTheme?.primary
                          : "6b7280"
                      ),
                      "--hover-backgroundColor": `#${
                        merchantTheme?.primary
                          ? merchantTheme?.primary
                          : "6b7280"
                      }`,
                      color: getTextColor(
                        activeCategory === category?.categoryId
                          ? `#${merchantTheme?.primary}`
                          : `#${merchantTheme?.primaryLight}`
                      ),
                      backgroundColor:
                        activeCategory === category?.categoryId
                          ? `#${merchantTheme?.primary}`
                          : `#${merchantTheme?.primaryLight}`,
                    } as React.CSSProperties
                  }
                >
                  <span className="text-sm">{getCategoryName(category)}</span>
                </Link>
              ))}
            </div>
          </ScrollPanel>
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
