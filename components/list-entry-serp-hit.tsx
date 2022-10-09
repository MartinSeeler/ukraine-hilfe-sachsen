import {
  BadgeCheckIcon,
  ChevronRightIcon,
  TranslateIcon,
} from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import React, { FC, useContext, useState } from "react";
import SearchContext from "../context/search-context";
import { SearchResult } from "../lib/types";
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
        <div className="flex items-center px-4 py-4 space-x-3 sm:px-6 hover:bg-gray-50">
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex items-center space-x-2 text-sm truncate">
              <p
                className="font-medium text-blue-600 truncate max-w-100 lg:text-lg"
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
              {/* <p className="flex-shrink-0 ml-1 font-normal text-gray-500">
                          in foo
                        </p> */}
            </div>
            <div className="flex mt-2">
              <div
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: entry.description,
                }}
              />
            </div>
            <div className="flex mt-2 text-xs text-gray-400">
              <p className="truncate">{entry.url}</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {entry.region
                .filter((region) => region.length > 0)
                .map((region) => (
                  <GeoSerpBadge
                    key={`${entry.id}-region-${region}`}
                    value={region}
                  />
                ))}
              {entry.tags
                .filter((tag) => tag.length > 0)
                .map((tag) => (
                  <IntentSerpBadge
                    key={`${entry.id}-region-${tag}`}
                    value={tag}
                  />
                ))}
            </div>
          </div>
          <div className="flex">
            <ChevronRightIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </a>
    </li>
  );
};

export default ListEntrySerpHit;
