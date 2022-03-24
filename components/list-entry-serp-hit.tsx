import { ChevronRightIcon, TranslateIcon } from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import React, { FC, useContext } from "react";
import SearchContext, { SerpHit } from "../context/search-context";

const ListEntrySerpHit: FC<{
  entry: SerpHit;
}> = ({ entry }) => {
  const { i18n } = useTranslation();
  const { onSerpClick } = useContext(SearchContext);
  return (
    <li>
      <a
        href={entry.data.url.raw}
        target="_blank"
        onClick={() => onSerpClick(entry.data.id.raw)}
        rel="noopener noreferrer nofollow"
        className="block hover:bg-gray-50"
      >
        <div className="px-4 py-4 flex items-center sm:px-6">
          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="">
              <div className="flex text-sm truncate">
                <p
                  className="font-medium text-blue-600 truncate lg:text-lg"
                  dangerouslySetInnerHTML={{
                    __html:
                      i18n.language === "ru"
                        ? entry.data.title_ru.snippet
                        : i18n.language === "uk"
                        ? entry.data.title_uk.snippet
                        : i18n.language === "en"
                        ? entry.data.title_en.snippet
                        : entry.data.title_de.snippet,
                  }}
                />
                {/* <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          in foo
                        </p> */}
              </div>
              <div className="mt-2 flex">
                <div
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html:
                      i18n.language === "ru"
                        ? entry.data.description_ru.snippet
                        : i18n.language === "uk"
                        ? entry.data.description_ua.snippet
                        : i18n.language === "en"
                        ? entry.data.description_en.snippet
                        : entry.data.description_de.snippet,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <TranslateIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <div className="flex space-x-3">
                  {entry.data.page_languages.raw.includes("de") && (
                    <span className="fi fi-de" />
                  )}
                  {entry.data.page_languages.raw.includes("en") && (
                    <span className="fi fi-us" />
                  )}
                  {entry.data.page_languages.raw.includes("ru") && (
                    <span className="fi fi-ru" />
                  )}
                  {entry.data.page_languages.raw.includes("uk") && (
                    <span className="fi fi-ua" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0">
            <ChevronRightIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </a>
    </li>
  );
};

export default ListEntrySerpHit;