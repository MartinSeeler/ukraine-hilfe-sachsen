import { pathOr } from "ramda";
import React, { useContext } from "react";
import SearchContext, { filters } from "../context/search-context";
import { MobileValueFacet } from "./value-facet";

const MobileFacetsBlock = () => {
  const { response } = useContext(SearchContext);
  return (
    <form className="mt-4">
      {filters.map((section) => (
        <MobileValueFacet
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
    </form>
  );
};

export default MobileFacetsBlock;
