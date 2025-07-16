import { ENGLISH } from "./../constant/site/constant";
import { StateCreator, create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";

type LanguageStore = {
  language: string;
  setLanguage: (language: string) => void;
};

type LanguagePersist = (
  config: StateCreator<LanguageStore>,
  options: PersistOptions<LanguageStore>
) => StateCreator<LanguageStore>;

export const useLanguageStore = create<LanguageStore, []>(
  (persist as LanguagePersist)(
    (set) => ({
      language: ENGLISH,
      setLanguage: (language: string) => set(() => ({ language: language })),
    }),
    {
      name: "language",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
