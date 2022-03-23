import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const languageOptions = [
  { name: "Deutsch", flag: "de", code: "de" },
  { name: "English", flag: "us", code: "en" },
  { name: "український", flag: "ua", code: "uk" },
  { name: "русский", flag: "ru", code: "ru" },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

const LanguageTabs: FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState<string>(
    () =>
      languageOptions.find((option) => option.code === i18n.language)?.code ||
      "de"
  );

  const onChangeLanguage = (lang: string) => {
    setLang(lang);
    i18n.changeLanguage(lang);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      lang,
    });
  };

  return (
    <div>
      <div className="md:block">
        <nav className="sm:flex grid grid-cols-4 space-x-4" aria-label="Tabs">
          {languageOptions.map((langOption) => (
            <button
              key={langOption.flag}
              onClick={() => onChangeLanguage(langOption.code)}
              className={classNames(
                lang === langOption.code
                  ? "bg-gray-200 text-gray-800"
                  : "text-gray-600 hover:text-gray-800",
                "px-3 py-2 font-medium text-sm rounded-md"
              )}
              aria-current={lang === langOption.code ? "page" : undefined}
            >
              <span className="hidden sm:inline-block mr-2">
                {langOption.name}
              </span>
              <span className={"fi " + ("fi-" + langOption.flag)}></span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LanguageTabs;
