import { useTranslation } from "next-i18next";
import { pathOr } from "ramda";
import React, { useContext } from "react";
import SearchContext from "../context/search-context";
import ListEntrySerpHit from "./list-entry-serp-hit";

const SerpHits = () => {
  const { response } = useContext(SearchContext);
  const { t } = useTranslation();
  const isSearching = false;
  return (
    <div className="mt-6 lg:mt-0 lg:col-span-3">
      <span className="flex lg:justify-end text-sm font-medium text-gray-700 mb-2">
        {t("search_description_short", "{{hits_count}} Links gefunden", {
          hits_count: pathOr(
            0,
            ["info", "meta", "page", "total_results"],
            response
          ),
        })}
      </span>
      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 overflow-hidden sm:rounded-md">
        <ul
          role="list"
          className={
            "divide-y divide-gray-200 " + (isSearching ? "opacity-50" : "")
          }
        >
          {/* @ts-ignore */}
          {response?.results?.map((entry: SerpHit) =>
            // <ListEntrySerpHit
            //   key={entry.data.id.raw}
            //   entry={entry}
            //   requestId={response.info?.meta?.request_id || "-1"}
            // />
            JSON.stringify(entry)
          )}
        </ul>
      </div>
      {/* {response?.results && response.results?.length === 0 && (
        <div className="p-4 text-center">
          <p className="text-gray-500">
            {t("no_results", "Keine Ergebnisse gefunden")}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default SerpHits;
