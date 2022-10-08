import { SearchResponse } from "@elastic/enterprise-search/lib/api/app/types";
import { ParsedUrlQuery } from "querystring";
import { filter, keysIn, mergeAll, map, pick, pathOr, uniq } from "ramda";
import { isNonEmptyArray, renameKeysWith } from "ramda-adjunct";
import { ActiveValFilters, SearchResult } from "./types";

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

export const resultFieldLocalMapping: {
  [locale: string]: { title: string; description: string };
} = {
  de: {
    title: "title_de",
    description: "description_de",
  },
  en: {
    title: "title_en",
    description: "description_en",
  },
  ru: {
    title: "title_ru",
    description: "description_ru",
  },
  uk: {
    title: "title_uk",
    description: "description_ua",
  },
};

export const getResultFieldsByLocale = (locale: string) => ({
  id: {
    raw: {},
  },
  page_languages: {
    raw: {},
  },
  url: {
    raw: {},
  },
  official: {
    raw: {},
  },
  region: {
    raw: {},
  },
  document: {
    raw: {},
  },
  region_country_city: {
    raw: {},
  },
  what: {
    raw: {},
  },
  [resultFieldLocalMapping[locale]?.title || "title_de"]: {
    snippet: {
      size: 256,
      fallback: true,
    },
  },
  [resultFieldLocalMapping[locale]?.description || "description_de"]: {
    snippet: {
      size: 256,
      fallback: true,
    },
  },
});

export const parseSearchResults = (
  response: SearchResponse,
  locale: string
) => {
  return map<object, SearchResult>(
    (hit: object) => ({
      id: pathOr("", ["id", "raw"], hit),
      title: pathOr(
        "",
        [resultFieldLocalMapping[locale]?.title || "title_de", "snippet"],
        hit
      ),
      description: pathOr(
        "",
        [
          resultFieldLocalMapping[locale]?.description || "description_de",
          "snippet",
        ],
        hit
      ),
      tags: pathOr([], ["what", "raw"], hit),
      region: uniq(
        filter(
          (x) => x !== "Sachsen" && x !== "Deutschland",
          [
            ...pathOr([], ["region", "raw"], hit),
            ...pathOr([], ["region_country_city", "raw"], hit),
          ]
        )
      ),
      url: pathOr("", ["url", "raw"], hit),
      page_languages: pathOr([], ["page_languages", "raw"], hit),
      official: pathOr<string>("false", ["official", "raw"], hit) === "true",
      document: pathOr<string>("false", ["document", "raw"], hit) === "true",
    }),
    response.results
  );
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
