import { CHINESE, ENGLISH, KHMER } from "@src/constant/site/constant";
import useUrlLang from "@src/hooks/useUrlLng";
import { useLanguageStore } from "@src/state/language";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, ScrollRestoration } from "react-router-dom";

const LanguageLayout = React.memo(() => {
  const { i18n } = useTranslation();
  const { lang, changeLanguage } = useUrlLang();
  const languageStore = useLanguageStore();

  useEffect(() => {
    if (
      lang !== CHINESE &&
      lang !== KHMER &&
      lang !== "admin" &&
      lang !== "login" &&
      lang !== ENGLISH
    ) {
      changeLanguage(ENGLISH);
    }
  }, [lang]);

  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
      languageStore.setLanguage(lang);
    }
  }, [lang]);
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
});

export default LanguageLayout;
