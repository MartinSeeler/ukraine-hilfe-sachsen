import { useTranslation } from "next-i18next";
import { pathOr } from "ramda";
import React, { useContext } from "react";
import SearchContext, { filters } from "../context/search-context";
import { DesktopValueFacet } from "./value-facet";

const DesktopFacetBlock = () => {
  const { response } = useContext(SearchContext);
  const { t } = useTranslation();
  return (
    <aside>
      <h2 className="sr-only">{t("filters_title", "Filter")}</h2>

      <div className="hidden lg:block">
        <span className="block text-sm font-medium text-gray-700 mb-2">
          {t("filters_more", "Mehr Filter")}
        </span>
        {filters.map((section) => (
          <DesktopValueFacet
            key={section.name}
            entries={pathOr<{ value: string; count: number }[]>(
              [],
              ["info", "facets", section.id, 0, "data"],
              response
            )}
            facetId={section.id}
            facetName={section.name}
          />
        ))}
      </div>
    </aside>
  );
};

export default DesktopFacetBlock;
