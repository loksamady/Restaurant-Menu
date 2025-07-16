import { MenuType } from "@src/types/website";
import MenuCard from "./MenuCard";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

type Props = {
  menus: MenuType[];
};

const SearchMenuSection = ({ menus }: Props) => {
  const { t } = useTranslation("");

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Menu Items or Empty State */}
      {menus.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menus.map((item) => (
            <MenuCard key={item.menuId} menu={item} />
          ))}
        </div>
      ) : (
        /* Empty State Template */
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            {/* Empty State Icon */}
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBoxOpen}
                className="text-5xl text-gray-400"
              />
            </div>

            <p className="text-gray-500 mb-6 text-xl font-semibold">
              {t("Menu not found")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchMenuSection;
