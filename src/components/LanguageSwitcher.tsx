/* eslint-disable @typescript-eslint/no-explicit-any */
import KhmerFlag from "@src/assets/languages/flag_of_khmer.png";
import EnglishFlag from "@src/assets/languages/flag_of_english.jpg";
import ChineseFlag from "@src/assets/languages/flag_of_chinese.png";
import useUrlLng from "@src/hooks/useUrlLng";
import { CHINESE, ENGLISH, KHMER } from "@src/constant/site/constant";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useState } from "react";

export default function LanguageToggle() {
  const { lang, changeLanguage } = useUrlLng();

  const languages = [
    { name: "English", code: ENGLISH, flag: EnglishFlag },
    { name: "ខ្មែរ", code: KHMER, flag: KhmerFlag },
    { name: "中文", code: CHINESE, flag: ChineseFlag },
  ];

  const defaultLanguage =
    lang === CHINESE
      ? languages[2]
      : lang === KHMER
      ? languages[1]
      : languages[0];

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const selectedLanguageTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <img
          src={option.flag}
          alt={option.name}
          width="10"
          height="50"
          loading="lazy"
          className="h-4 w-7 cursor-pointer"
        />
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const languageOptionTemplate = (option: any) => {
    return (
      <div className="flex items-center gap-2 my-2 cursor-pointer hover:text-blue-500">
        <img
          src={option.flag}
          alt={option.name}
          width="10"
          height="50"
          loading="lazy"
          className="h-4 w-7"
        />
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={selectedLanguage}
        options={languages}
        optionLabel="name"
        optionValue="code"
        valueTemplate={selectedLanguageTemplate}
        itemTemplate={languageOptionTemplate}
        className="w-full md:w-10rem"
        panelClassName="mt-2 py-2 px-4 bg-white border rounded-md"
        unstyled
        dropdownIcon={() => {
          return null;
        }}
        onChange={(e: DropdownChangeEvent) => {
          setSelectedLanguage(e.value);
          changeLanguage(e.value.code);
        }}
      />
    </div>
  );
}
