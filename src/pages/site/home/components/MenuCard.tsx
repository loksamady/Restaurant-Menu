import { EMPTY } from "@src/constant/admin/constant";
import { IMAGE_URL } from "@src/constant/env";
import { CHINESE, KHMER } from "@src/constant/site/constant";
import useUrlLng from "@src/hooks/useUrlLng";
import { useWebsiteStore } from "@src/state/website";
import { MenuFileType } from "@src/types/website";
import { CategoryType, MenuType } from "@src/types/website";
import { getTextColor } from "@src/util/themeColorUtil";
import { Dialog } from "primereact/dialog";
import { Galleria } from "primereact/galleria";
import { Image } from "primereact/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"; // Add this at the top with your imports
// ...existing code...
type Props = {
  menu: MenuType;
};
const MenuCard = ({ menu }: Props) => {
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
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Product Detail Dialog */}
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        dismissableMask
        closable
        style={{ width: "90vw", maxWidth: "600px" }}
        contentClassName="p-2 md:p-8"
        headerClassName="pb-4"
        breakpoints={{ "960px": "100vw" }}
      >
        <div className="relative">
          {/* Image Gallery Section */}
          <div className="rounded-t-lg">
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
                />
              </div>
            ) : (
              <div
                className="min-h-64 md:min-h-96 flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, #${merchantTheme?.primaryLight}, #${merchantTheme?.primary})`,
                }}
              >
                <div className="text-8xl">🍽️</div>
              </div>
            )}

            {/* Overlay Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
              {menu?.hot && (
                <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                  <span className="text-sm">🔥</span>
                  HOT
                </div>
              )}
              {hasDiscount && (
                <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  -{discountAmount}% OFF
                </div>
              )}
            </div>

            {/* Menu Code */}
            {menu?.code && (
              <div className="absolute top-6 right-6 bg-black/75 text-white px-3 py-2 rounded-full shadow-md md:text-lg font-mono z-10">
                #{menu?.code}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="py-4">
            {/* Header Info */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {menuName}
                  </h1>
                  {menu?.menuId && (
                    <span className="text-sm font-mono font-bold bg-gray-200 px-2 py-1 rounded-full">
                      CODE: {menu?.code}
                    </span>
                  )}
                </div>

                {/* Categories */}
                {menu?.categories && menu?.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {menu?.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `#${merchantTheme?.primaryLight}`,
                          color:
                            merchantTheme?.primaryLight &&
                            getTextColor(merchantTheme?.primaryLight),
                        }}
                      >
                        {getCategoryName(category)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* add button cart */}
              <div onClick={() => setVisible(true)} className="p-6 space-y-4">
                <div className="flex items-center justify-center pt-2 border-gray-100">
                  <div className="flex gap-3 flex-col justify-center items-center">
                    <button
                      type="button"
                      className="ml-4 flex items-center justify-center bg-yellow-600 text-white rounded-full p-2 shadow transition"
                      title="Add to cart"
                    >
                      <MinusCircle className="w-6 h-6" />
                      <p className="flex items-center gap-x5 mx-1">
                        <span className="min-w-7 grid place-items-center border rounded-full">
                          1
                        </span>
                      </p>
                      <PlusCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("pricing")}
              </h3>
              <div className="space-y-3">
                {/* USD Pricing */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t("usdPrice")}:</span>
                  <div className="flex items-center gap-3">
                    {hasDiscount ? (
                      <>
                        <span
                          className="text-3xl font-bold"
                          style={{ color: `#${merchantTheme?.primary}` }}
                        >
                          $ {finalPrice.toFixed(2)}
                        </span>
                        <span className="text-xl text-gray-400 line-through">
                          $ {originalPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-3xl font-bold"
                        style={{ color: `#${merchantTheme?.primary}` }}
                      >
                        $ {originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* KH Pricing */}
                {menu?.priceKh && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t("khmerPrice")} :</span>
                    <div className="flex items-center gap-3">
                      {hasDiscount ? (
                        <>
                          <span
                            className="text-2xl font-bold"
                            style={{ color: `#${merchantTheme?.primary}` }}
                          >
                            ៛{" "}
                            {(
                              menu?.priceKh *
                              (1 - discountAmount / 100)
                            ).toLocaleString()}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ៛ {menu?.priceKh.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-2xl font-bold"
                          style={{ color: `#${merchantTheme?.primary}` }}
                        >
                          ៛ {menu?.priceKh.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {hasDiscount && (
                  <div
                    className="pt-3 border-t"
                    style={{ borderColor: `#${merchantTheme?.primaryLight}` }}
                  >
                    <div className="flex items-center justify-between text-green-600">
                      <span className="font-medium">{t("youSave")} :</span>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${" "}
                          {((originalPrice * discountAmount) / 100).toFixed(2)}
                        </div>
                        {menu?.priceKh && (
                          <div className="text-sm">
                            ៛{" "}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("description")}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {menuDescription || EMPTY}
              </p>
            </div>
          </div>
        </div>
      </Dialog>
      {/* Original Card Content */}
      <div
        onClick={() => setVisible(true)}
        className="relative overflow-hidden cursor-pointer"
      >
        {fileName ? (
          <img
            src={filePath ? filePath : `${IMAGE_URL}/${fileName}`}
            alt={menu?.nameEn || "Menu item"}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-64 flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(to bottom right, #${merchantTheme?.primaryLight}, #${merchantTheme?.primary})`,
            }}
          >
            <div className="text-6xl">🍽️</div>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {menu?.hot && (
            <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
              <span className="text-sm">🔥</span>
              HOT
            </div>
          )}
          {hasDiscount && (
            <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              -{discountAmount}% OFF
            </div>
          )}
        </div>

        {/* Menu Code Badge */}
        {menu?.code && (
          <div className="absolute top-4 right-4 bg-black/75 text-white px-4 py-1 rounded-full shadow-md md:text-lg font-mono">
            #{menu?.code}
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      {/* Content Section */}
      <div onClick={() => setVisible(true)} className="p-6 space-y-4">
        {/* Title */}
        <p
          className="font-bold text-xl lg:text-2xl text-gray-800 group-hover:text-[color:var(--hover-color)] transition-colors duration-300"
          style={
            {
              "--hover-color": `#${merchantTheme?.primary}`,
            } as React.CSSProperties
          }
        >
          {menuName}
        </p>
        {/* Pricing Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            {/* USD Price */}
            {menu?.price ? (
              <div className="flex items-center gap-2">
                {hasDiscount ? (
                  <>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: `#${merchantTheme?.primary}` }}
                    >
                      $ {finalPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      $ {originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-2xl font-bold"
                    style={{ color: `#${merchantTheme?.primary}` }}
                  >
                    $ {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            ) : (
              <span
                className="text-2xl font-bold"
                style={{ color: `#${merchantTheme?.primary}` }}
              >
                $ 0.00
              </span>
            )}

            {/* KH Price */}
            {menu?.priceKh && (
              <div className="flex items-center gap-2 mt-1">
                {hasDiscount ? (
                  <>
                    <span
                      className="text-xl font-bold"
                      style={{ color: `#${merchantTheme?.primary}` }}
                    >
                      ៛{" "}
                      {(
                        menu?.priceKh *
                        (1 - discountAmount / 100)
                      ).toLocaleString()}
                    </span>
                    <span className="text-gray-400 line-through">
                      ៛ {menu?.priceKh.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-xl font-bold"
                    style={{ color: `#${merchantTheme?.primary}` }}
                  >
                    ៛ {menu?.priceKh.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* add button cart */}
          <div onClick={() => setVisible(true)} className="p-6 space-y-4">
            <div className="flex items-center justify-center pt-2 border-gray-100">
              <div className="flex gap-3 flex-col justify-center items-center">
                <button
                  type="button"
                  className="ml-4 flex items-center justify-center bg-yellow-600 text-white rounded-full p-2 shadow transition"
                  title="Add to cart"
                >
                  <MinusCircle className="w-6 h-6" />
                  <p className="flex items-center gap-x5 mx-1">
                    <span className="min-w-7 grid place-items-center border rounded-full">
                      1
                    </span>
                  </p>
                  <PlusCircle className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="ml-4 flex items-center justify-center bg-yellow-600 text-white rounded-full p-2 shadow transition"
                  title="remove"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
                {/* <button
                  type="button"
                  className="ml-4 flex items-center justify-center bg-yellow-600 text-white rounded-full p-2 shadow transition"
                  title="Add to cart"
                >
                  <PlusCircle className="w-6 h-6" />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hover Effect Accent */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{
          backgroundImage: `linear-gradient(to right, #${merchantTheme?.primary}, #${merchantTheme?.secondary})`,
        }}
      ></div>
    </div>
  );
};

export default MenuCard;
