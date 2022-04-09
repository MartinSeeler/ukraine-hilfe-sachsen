import {
  BadgeCheckIcon,
  ChevronRightIcon,
  TranslateIcon,
} from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import React, { FC, useContext, useState } from "react";
import SearchContext, { SearchResult } from "../context/search-context";
import { GeoSerpBadge, IntentSerpBadge } from "./serp-badge";

const ListEntrySerpHit: FC<{
  entry: SearchResult;
}> = ({ entry }) => {
  const { onSerpClick } = useContext(SearchContext);

  const { i18n } = useTranslation();
  const [targetUrl] = useState(() =>
    i18n.language !== "de" && !entry.document
      ? `http://translate.google.com/translate?js=n&sl=de&tl=${
          i18n.language
        }&u=${encodeURIComponent(entry.url)}`
      : entry.url
  );

  return (
    <li>
      <a
        href={targetUrl}
        target="_blank"
        onClick={() => onSerpClick(entry.id)}
        rel="noopener noreferrer nofollow"
        className=""
      >
        <div className="px-4 py-4 flex items-center sm:px-6 space-x-3 hover:bg-gray-50">
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex text-sm truncate items-center space-x-2">
              <p
                className="font-medium text-blue-600 max-w-100 truncate lg:text-lg"
                dangerouslySetInnerHTML={{
                  __html: entry.title,
                }}
              />
              {entry.official === true && (
                <div className="flex text-sm leading-5 text-gray-500">
                  <BadgeCheckIcon
                    className="w-5 h-5 text-blue-500"
                    aria-hidden="true"
                  />
                </div>
              )}
              {/* <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          in foo
                        </p> */}
            </div>
            <div className="mt-2 flex">
              <div
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: entry.description,
                }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-400 flex">
              <p className="truncate">{entry.url}</p>
            </div>
            {/* <div className="mt-3 flex flex-wrap gap-3">
              {entry.region.map((region) => (
                <GeoSerpBadge
                  key={`${entry.id}-region-${region}`}
                  value={region}
                />
              ))}
              {entry.tags.map((tag) => (
                <IntentSerpBadge
                  key={`${entry.id}-region-${tag}`}
                  value={tag}
                />
              ))}
            </div> */}
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <TranslateIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <div className="flex space-x-3">
                {entry.page_languages.includes("de") && (
                  <span className="fi fi-de" />
                )}
                {entry.page_languages.includes("en") && (
                  <span className="fi fi-us" />
                )}
                {entry.page_languages.includes("ru") && (
                  <span className="fi fi-ru" />
                )}
                {entry.page_languages.includes("uk") && (
                  <span className="fi fi-ua" />
                )}
              </div>
            </div>
          </div>
          <div className="flex">
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
