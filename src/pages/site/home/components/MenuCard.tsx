import { EMPTY } from "@src/constant/admin/constant";
import { IMAGE_URL } from "@src/constant/env";
import { CHINESE, KHMER } from "@src/constant/site/constant";
import useUrlLng from "@src/hooks/useUrlLng";
import { useWebsiteStore } from "@src/state/website";
import { MenuFileType } from "@src/types/website";
import { CategoryType, MenuType } from "@src/types/website";
import { Dialog } from "primereact/dialog";
import { Galleria } from "primereact/galleria";
import { Image } from "primereact/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { userStore } from "@src/state/store";
import ChangeQtyButtons from "./ChangeQtyButtons";
type Props = {
  menu: MenuType;
};
const MenuCard = ({ menu }: Props) => {
  const addMenu = userStore((state) => state.addMenu);
  const cartMenus = userStore((state) => state.menus);
  const { lang } = useUrlLng();
  const { t } = useTranslation("site");
  const { merchantTheme } = useWebsiteStore();

  const numVisible = 5;
  const hasFiles = Array.isArray(menu?.files) && menu?.files.length > 0;
  const fileName = hasFiles
    ? menu?.files.find((file) => file.main)?.fileName ?? menu?.files[0].fileName
    : null;
  const filePath = hasFiles
    ? menu?.files.find((file) => file.main)?.filePath ?? menu?.files[0].filePath
    : null;

  const originalPrice = menu?.price || 0;
  const discountAmount = menu?.discount || 0;
  const finalPrice = originalPrice - (originalPrice * discountAmount) / 100;
  const hasDiscount = discountAmount > 0;
  const menuName =
    lang === CHINESE
      ? menu?.nameCn
      : lang === KHMER
      ? menu?.nameKh
      : menu?.nameEn;
  const menuDescription =
    lang === CHINESE
      ? menu?.descriptionCn
      : lang === KHMER
      ? menu?.descriptionKh
      : menu?.descriptionEn;

  const getCategoryName = (category: CategoryType) => {
    return lang === CHINESE
      ? category?.nameCn
      : lang === KHMER
      ? category?.nameKh
      : category?.nameEn;
  };

  const [visible, setVisible] = useState<boolean>(false);

  const imageTemplate = (file: MenuFileType) => {
    return (
      <Image
        src={file?.filePath ? file?.filePath : `${IMAGE_URL}/${file.fileName}`}
        alt="Menu"
        className="h-52 md:h-72 xl:h-96 w-full overflow-hidden rounded-t-lg bg-black"
        imageClassName="w-full h-full object-cover"
      />
    );
  };

  const thumbnailTemplate = (file: MenuFileType) => {
    return (
      <Image
        src={file?.filePath ? file?.filePath : `${IMAGE_URL}/${file.fileName}`}
        alt="Menu"
        imageClassName="h-14 object-contain"
        preview
      />
    );
  };
  return (
    <div className="relative group">
      {/* Main Card Container */}
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100 hover:border-gray-200">
        {/* Product Detail Dialog */}
        <Dialog
          visible={visible}
          onHide={() => setVisible(false)}
          dismissableMask
          closable
          style={{ width: "90vw", maxWidth: "700px" }}
          contentClassName="p-0"
          headerClassName="hidden"
          breakpoints={{ "960px": "100vw" }}
          className="menu-detail-dialog"
        >
          <div className="relative bg-white rounded-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setVisible(false)}
              className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/40 transition-all duration-200"
            >
              <i className="pi pi-times text-lg"></i>
            </button>

            {/* Image Gallery Section */}
            <div className="relative">
              {menu?.files && menu?.files.length > 0 ? (
                <div className="card">
                  <Galleria
                    numVisible={numVisible}
                    value={menu?.files}
                    circular
                    showItemNavigators={menu?.files.length > 1}
                    item={imageTemplate}
                    thumbnail={thumbnailTemplate}
                    showThumbnailNavigators={menu?.files.length > numVisible}
                    className="menu-galleria"
                  />
                </div>
              ) : (
                <div
                  className="h-80 flex items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #${merchantTheme?.primaryLight}20, #${merchantTheme?.primary}40)`,
                  }}
                >
                  <div className="text-8xl opacity-60">🍽️</div>
                </div>
              )}

              {/* Overlay Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
                {menu?.hot && (
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                    <span className="text-lg">🔥</span>
                    HOT
                  </div>
                )}
                {hasDiscount && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{discountAmount}% OFF
                  </div>
                )}
              </div>

              {/* Menu Code */}
              {menu?.code && (
                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg font-mono text-sm z-20">
                  #{menu?.code}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Header Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                      {menuName}
                    </h1>
                    {menu?.menuId && (
                      <span className="text-xs font-mono font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                        {menu?.code}
                      </span>
                    )}
                  </div>

                  {/* Categories */}
                  {menu?.categories && menu?.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {menu?.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                          style={{
                            backgroundColor: `#${merchantTheme?.primaryLight}30`,
                            color: `#${merchantTheme?.primary}`,
                            border: `1px solid #${merchantTheme?.primaryLight}50`,
                          }}
                        >
                          {getCategoryName(category)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <i className="pi pi-dollar text-green-500"></i>
                  {t("pricing")}
                </h3>
                <div className="space-y-6">
                  {/* USD Pricing */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      {t("usdPrice")}:
                    </span>
                    <div className="flex items-center gap-4">
                      {hasDiscount ? (
                        <>
                          <span
                            className="text-4xl font-bold"
                            style={{ color: `#${merchantTheme?.primary}` }}
                          >
                            ${finalPrice.toFixed(2)}
                          </span>
                          <span className="text-2xl text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-4xl font-bold"
                          style={{ color: `#${merchantTheme?.primary}` }}
                        >
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* KH Pricing */}
                  {menu?.priceKh && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        {t("khmerPrice")}:
                      </span>
                      <div className="flex items-center gap-4">
                        {hasDiscount ? (
                          <>
                            <span
                              className="text-3xl font-bold"
                              style={{ color: `#${merchantTheme?.primary}` }}
                            >
                              ៛
                              {(
                                menu?.priceKh *
                                (1 - discountAmount / 100)
                              ).toLocaleString()}
                            </span>
                            <span className="text-xl text-gray-400 line-through">
                              ៛{menu?.priceKh.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span
                            className="text-3xl font-bold"
                            style={{ color: `#${merchantTheme?.primary}` }}
                          >
                            ៛{menu?.priceKh.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="pt-6 border-t border-gray-300">
                      <div className="flex items-center justify-between text-green-600">
                        <span className="font-semibold text-lg">
                          {t("youSave")}:
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            $
                            {((originalPrice * discountAmount) / 100).toFixed(
                              2
                            )}
                          </div>
                          {menu?.priceKh && (
                            <div className="text-lg">
                              ៛
                              {(
                                (menu?.priceKh * discountAmount) /
                                100
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="pi pi-info-circle text-blue-500"></i>
                  {t("description")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {menuDescription || EMPTY}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {cartMenus.find(
                  (menuItem) => menuItem.menu.menuId === menu.menuId
                ) ? (
                  <div className="flex-1">
                    <ChangeQtyButtons menuId={menu.menuId} />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addMenu(menu, 1);
                      setVisible(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <i className="pi pi-shopping-cart text-lg"></i>
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={() => setVisible(false)}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Dialog>
        {/* Main Card Image */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => setVisible(true)}
        >
          {fileName ? (
            <div className="relative">
              <img
                src={filePath ? filePath : `${IMAGE_URL}/${fileName}`}
                alt={menu?.nameEn || "Menu item"}
                className="w-full h-72 object-cover transition-all duration-700 group-hover:scale-110"
              />
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Quick View Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <i className="pi pi-eye mr-2"></i>Quick View
                </button>
              </div>
            </div>
          ) : (
            <div
              className="w-full h-72 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: `linear-gradient(135deg, #${merchantTheme?.primaryLight}30, #${merchantTheme?.primary}60)`,
              }}
            >
              <div className="text-7xl opacity-70 transform group-hover:scale-110 transition-transform duration-500">
                🍽️
              </div>
            </div>
          )}

          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-3 z-10">
            {menu?.hot && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1 animate-pulse">
                <span className="text-sm">🔥</span>
                HOT
              </div>
            )}
            {hasDiscount && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl">
                -{discountAmount}% OFF
              </div>
            )}
          </div>

          {/* Menu Code Badge */}
          {menu?.code && (
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg font-mono text-sm">
              #{menu?.code}
            </div>
          )}

          {/* Favorite Icon */}
          {/* <div className="absolute top-4 right-16 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white/30">
            <i className="pi pi-heart text-white text-lg"></i>
          </div> */}
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-4" onClick={() => setVisible(true)}>
            <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 cursor-pointer">
              {menuName}
            </h3>
            {menuDescription && (
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {menuDescription}
              </p>
            )}
          </div>

          {/* Categories */}
          {menu?.categories && menu?.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {menu?.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                >
                  {getCategoryName(category)}
                </span>
              ))}
              {menu?.categories.length > 2 && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  +{menu?.categories.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Pricing Section */}
          <div className="mb-6">
            {/* USD Price */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Price:</span>
              <div className="flex items-center gap-3">
                {hasDiscount ? (
                  <>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: `#${merchantTheme?.primary}` }}
                    >
                      ${finalPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-2xl font-bold"
                    style={{ color: `#${merchantTheme?.primary}` }}
                  >
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* KH Price */}
            {menu?.priceKh && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-medium">
                  ៛ Price:
                </span>
                <div className="flex items-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span
                        className="text-xl font-bold"
                        style={{ color: `#${merchantTheme?.primary}` }}
                      >
                        ៛
                        {(
                          menu?.priceKh *
                          (1 - discountAmount / 100)
                        ).toLocaleString()}
                      </span>
                      <span className="text-base text-gray-400 line-through">
                        ៛{menu?.priceKh.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-xl font-bold"
                      style={{ color: `#${merchantTheme?.primary}` }}
                    >
                      ៛{menu?.priceKh.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Savings Display */}
            {hasDiscount && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center justify-between text-green-700">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <i className="pi pi-tag text-xs"></i>
                    You Save:
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${((originalPrice * discountAmount) / 100).toFixed(2)}
                    </div>
                    {menu?.priceKh && (
                      <div className="text-sm">
                        ៛
                        {(
                          (menu?.priceKh * discountAmount) /
                          100
                        ).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            {cartMenus.find(
              (menuItem) => menuItem.menu.menuId === menu.menuId
            ) ? (
              <div className="w-full">
                <ChangeQtyButtons menuId={menu.menuId} />
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addMenu(menu, 1);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <i className="pi pi-shopping-cart text-lg group-hover:animate-bounce"></i>
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* Hover Effect Accent */}
        <div
          className="absolute inset-x-0 bottom-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{
            backgroundImage: `linear-gradient(to right, #${
              merchantTheme?.primary
            }, #${merchantTheme?.secondary || merchantTheme?.primary})`,
          }}
        ></div>
      </div>

      {/* Floating Add Button (Alternative Design) */}
      {!cartMenus.find((menuItem) => menuItem.menu.menuId === menu.menuId) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addMenu(menu, 1);
          }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
        >
          <i className="pi pi-plus text-lg"></i>
        </button>
      )}

      {/* Custom Styles */}
      <style>{`
        .menu-detail-dialog .p-dialog-content {
          padding: 0 !important;
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .menu-detail-dialog .p-dialog {
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .menu-galleria .p-galleria-thumbnail-wrapper {
          padding: 1rem;
        }
        
        .menu-galleria .p-galleria-thumbnail-item {
          border-radius: 0.5rem;
          overflow: hidden;
          margin: 0 0.25rem;
        }
        
        .menu-galleria .p-galleria-thumbnail-item.p-galleria-thumbnail-item-current {
          border: 2px solid #3b82f6;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .card-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
        
        @media (hover: hover) {
          .group:hover .card-shimmer::before {
            animation: shimmer 1.5s ease-in-out;
          }
        }
      `}</style>
    </div>
  );
};

export default MenuCard;
