import MenuCard from "./MenuCard";
import useUrlLng from "@src/hooks/useUrlLng";
import { useTranslation } from "react-i18next";
import { CHINESE, KHMER } from "@src/constant/site/constant";
import { useWebsiteStore } from "@src/state/website";
import { CategoryType, MenuType } from "@src/types/website";
import { staticCategories } from "@src/static/menu";

const HomeMainSection = () => {
  const { lang } = useUrlLng();
  const { t } = useTranslation("site");
  const { categories, menus, merchant, merchantTheme } = useWebsiteStore();

  const getCategoryName = (category: CategoryType) => {
    return lang === CHINESE
      ? category?.nameCn
      : lang === KHMER
      ? category?.nameKh
      : category?.nameEn;
  };

  const sectionTemplate = (
    category: CategoryType,
    categoryMenus?: MenuType[]
  ) => {
    return (
      <section
        key={category?.categoryId}
        id={`${merchant?.slug}/category-${category?.categoryId}`}
        className="mb-12"
      >
        {/* Category Header */}
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {getCategoryName(category)}
          </h2>
          <div
            className="flex-1 h-px"
            style={{
              backgroundImage: `linear-gradient(to right, #${merchantTheme?.primary}, transparent)`,
            }}
          ></div>
          {categoryMenus && (
            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full shadow-sm">
              {categoryMenus.length} {t("items")}
            </span>
          )}
        </div>

        {/* Menu Items or Empty State */}
        {categoryMenus && categoryMenus.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryMenus.map((item) => (
              <MenuCard key={item.menuId} menu={item} />
            ))}
          </div>
        ) : (
          /* Empty State Template */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              {/* Empty State Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              {/* Empty State Content */}
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {`${t("noItemsIn")} ${getCategoryName(category)}`}
              </h3>
              <p className="text-gray-500 mb-6">{t("categoryEmpty")}</p>
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {categories && categories.length > 0 ? (
        categories.map((category: CategoryType) => {
          // Filter menus for this category
          const categoryMenus = menus.filter((menu) =>
            menu.categories.some((c) => c.categoryId === category?.categoryId)
          );

          return (
            categoryMenus &&
            categoryMenus.length > 0 &&
            sectionTemplate(category, categoryMenus)
          );
        })
      ) : (
        <div>
          {staticCategories.map((category) =>
            sectionTemplate(category, category?.menus)
          )}
        </div>
      )}
    </main>
  );
};

export default HomeMainSection;
