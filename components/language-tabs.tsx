import { useRouter } from "next/router";
import React, { FC } from "react";

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
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const onChangeLanguage = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
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
                locale === langOption.code
                  ? "bg-gray-200 text-gray-800"
                  : "text-gray-600 hover:text-gray-800",
                "px-3 py-2 font-medium text-sm rounded-md"
              )}
              aria-current={locale === langOption.code ? "page" : undefined}
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
