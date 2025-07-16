import homeHero from "@src/assets//img/footer.png";
import { IMAGE_URL } from "@src/constant/env";
import { CHINESE, KHMER } from "@src/constant/site/constant";
import useUrlLng from "@src/hooks/useUrlLng";
import { useWebsiteStore } from "@src/state/website";
import { FileType } from "@src/types/file";
import { Galleria } from "primereact/galleria";
import { Image } from "primereact/image";

const HomeHero = () => {
  const { lang } = useUrlLng();
  const { merchant, merchantTheme } = useWebsiteStore();
  const title =
    lang === CHINESE
      ? merchant?.titleCn
      : lang === KHMER
      ? merchant?.titleKh
      : merchant?.titleEn;
  const description =
    lang === CHINESE
      ? merchant?.descriptionCn
      : lang === KHMER
      ? merchant?.descriptionKh
      : merchant?.descriptionEn;

  const itemTemplate = (file: FileType) => {
    return (
      <Image
        src={`${IMAGE_URL}/merchant_logos/${file.fileName}`}
        alt="merchant-banner"
        className="w-full block"
        imageClassName="max-h-40 md:max-h-[300px] xl:max-h-[500px] w-full"
      />
    );
  };
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return (
    <section className="relative flex items-center justify-center w-full h-full shadow-sm overflow-hidden">
      {merchant?.banners && merchant?.banners.length > 0 ? (
        <Galleria
          value={merchant?.banners}
          showThumbnails={false}
          item={itemTemplate}
          showIndicators={merchant?.banners.length > 1}
          showIndicatorsOnItem
          indicatorsPosition="bottom"
          showItemNavigatorsOnHover={!isTouchDevice}
          showItemNavigators={merchant?.banners.length > 1}
          transitionInterval={5000}
          autoPlay
          circular
          className="w-full"
        />
      ) : (
        <div className="relative w-full">
          <Image
            src={homeHero}
            alt="merchant-banner"
            className="w-full block"
            imageClassName="max-h-40 md:max-h-[300px] xl:max-h-[500px] w-full"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #${merchantTheme?.primary}50, #${merchantTheme?.primaryDark}50)`,
            }}
          ></div>
        </div>
      )}

      <div className="absolute mx-14 md:mx-36 xl:mx-44 text-center text-white z-10">
        <h2 className="text-xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-6">
          {title}
        </h2>
        <p className="text-sm md:text-base lg:text-lg xl:text-xl md:mb-4">
          {description}
        </p>
      </div>
    </section>
  );
};

export default HomeHero;
