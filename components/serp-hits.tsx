import { TranslateIcon, TrashIcon } from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import SearchContext from "../context/search-context";
import { SearchResult } from "../lib/types";
import ListEntrySerpHit from "./list-entry-serp-hit";

const SerpHits = () => {
  const { totalHits, isSearching, searchResults, onReset } =
    useContext(SearchContext);
  const { t } = useTranslation();

  return (
    <div className="mt-6 lg:mt-0 lg:col-span-3">
      <span className="flex mb-2 text-sm font-medium text-gray-700">
        {isSearching
          ? "..."
          : t("search_description_short", "{{hits_count}} Links gefunden", {
              hits_count: totalHits,
            })}
      </span>
      <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-md">
        <ul role="list" className={"divide-y divide-gray-200"}>
          {" "}
          {isSearching
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={"search-placeholder-" + i}
                  className="flex flex-col items-center flex-1 w-full px-4 py-4 sm:px-6"
                >
                  <div className="flex-row items-center justify-center w-full space-x-3 animate-pulse">
                    <div className="flex flex-col space-y-2">
                      <div className="w-7/12 h-6 mb-2 bg-blue-600 rounded-md"></div>
                      <div className="w-9/12 h-5 bg-gray-300 rounded-md"></div>
                      <div className="w-6/12 h-4 bg-gray-200 rounded-md "></div>
                      <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                        {/* <TranslateIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        /> */}
                        <div className="w-1/12 h-4 rounded-md bg-amber-600 "></div>
                        <div className="w-1/12 h-4 bg-green-600 rounded-md "></div>
                        <div className="w-1/12 h-4 bg-green-600 rounded-md "></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : searchResults.map((entry: SearchResult) => (
                <ListEntrySerpHit key={entry.id} entry={entry} />
              ))}
        </ul>
      </div>
      {totalHits === 0 && (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="text-gray-500">
            {t("no_results", "Keine Ergebnisse gefunden")}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center px-4 py-2 mt-5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:z-10 focus:outline-none"
          >
            <span className="flex">
              {t("filters_reset", "Filter zurücksetzen")}
            </span>
            <span className="inline-flex items-center justify-end flex-shrink-0 w-6 h-6">
              <TrashIcon
                className="w-5 h-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SerpHits;
