import site_en from "../locales/en/site.json";
import site_kh from "../locales/kh/site.json";
import site_cn from "../locales/cn/site.json";

export const i18nConfig = {
  interpolation: { escapeValue: false },
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      site: site_en,
    },
    kh: {
      site: site_kh,
    },
    cn: {
      site: site_cn,
    },
  },
};
