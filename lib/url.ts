import { ParsedUrlQuery } from "querystring";
import { filter, keysIn, mergeAll, map, pick } from "ramda";
import { isNonEmptyArray, renameKeysWith } from "ramda-adjunct";
import { ActiveValFilters } from "./types";

export const facetsToQuery: (facets: ActiveValFilters) => {
  [key: string]: string;
} = (facets) => {
  const relevantKeys = filter(
    (x: string) => facets[x] && isNonEmptyArray(facets[x]),
    keysIn(facets)
  );
  const query: { [key: string]: string } = mergeAll(
    map((k: string) => {
      return { [`f.${k}`]: facets[k].join(",") };
    }, relevantKeys)
  );
  return query;
};

export const parseActiveValFiltersFromQuery: (
  query: ParsedUrlQuery
) => ActiveValFilters = (query) => {
  const relevantKeys: string[] = filter(
    (x: string) => x.startsWith("f.") && query[x] !== "",
    keysIn(query)
  );
  const facets: ActiveValFilters = map((v: string | string[] | undefined) => {
    return v ? (Array.isArray(v) ? v : v.split(",")) : [];
  }, pick(relevantKeys, query));
  const renamedFacets: ActiveValFilters = {
    ...renameKeysWith((k: string) => k.replace("f.", ""), facets),
  };
  return renamedFacets;
};

export const parseQueryStringFromQuery: (query: ParsedUrlQuery) => string = (
  query
) => {
  return query.q ? (Array.isArray(query.q) ? query.q[0] : query.q) : "";
};

export const parseLocaleFromQuery: (query: ParsedUrlQuery) => string = (
  query
) => {
  return query.l ? (Array.isArray(query.l) ? query.l[0] : query.l) : "de";
};
