import { TranslateIcon, TrashIcon } from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import SearchContext, { SearchResult } from "../context/search-context";
import ListEntrySerpHit from "./list-entry-serp-hit";

const SerpHits = () => {
  const { totalHits, isSearching, searchResults, onReset } =
    useContext(SearchContext);
  const { t } = useTranslation();

  return (
    <div className="mt-6 lg:mt-0 lg:col-span-3">
      <span className="flex text-sm font-medium text-gray-700 mb-2">
        {isSearching
          ? "..."
          : t("search_description_short", "{{hits_count}} Links gefunden", {
              hits_count: totalHits,
            })}
      </span>
      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 overflow-hidden sm:rounded-md">
        <ul role="list" className={"divide-y divide-gray-200"}>
          {" "}
          {isSearching
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={"search-placeholder-" + i}
                  className="flex w-full flex-1 flex-col items-center px-4 sm:px-6 py-4"
                >
                  <div className="w-full animate-pulse flex-row items-center justify-center space-x-3">
                    <div className="flex flex-col space-y-2">
                      <div className="h-6 mb-2 w-7/12 rounded-md bg-blue-600"></div>
                      <div className="h-5 w-9/12 rounded-md bg-gray-300"></div>
                      <div className="h-4 w-6/12 rounded-md bg-gray-200 "></div>
                      <div className="mt-3 flex items-center text-sm text-gray-500 gap-3">
                        {/* <TranslateIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        /> */}
                        <div className="h-4 w-1/12 rounded-md bg-amber-600 "></div>
                        <div className="h-4 w-1/12 rounded-md bg-green-600 "></div>
                        <div className="h-4 w-1/12 rounded-md bg-green-600 "></div>
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
        <div className="p-4 text-center items-center flex flex-col">
          <p className="text-gray-500">
            {t("no_results", "Keine Ergebnisse gefunden")}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-5 flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
          >
            <span className="flex">
              {t("filters_reset", "Filter zurücksetzen")}
            </span>
            <span className="flex-shrink-0 h-6 w-6 inline-flex items-center justify-end">
              <TrashIcon
                className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
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
