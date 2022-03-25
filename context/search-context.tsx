// @ts-ignore
import * as ElasticAppSearch from "@elastic/app-search-javascript";
import * as Sentry from "@sentry/react";
import { useRouter } from "next/router";
import {
  chain,
  filter,
  keysIn,
  map,
  mergeAll,
  pathOr,
  pick,
  propOr,
} from "ramda";
import { isEmptyString, isNonEmptyArray, renameKeysWith } from "ramda-adjunct";
import { createContext, useEffect, useState } from "react";

export const getClient = () =>
  ElasticAppSearch.createClient({
    searchKey: "search-ycf9f6qz3944w8wbdq122b3v",
    endpointBase:
      "https://my-deployment-68ff1c.ent.europe-west3.gcp.cloud.es.io",
    engineName: "ukraine-help",
  });

export const filters = [
  {
    id: "intents_level_two",
    name: "intents_level_two",
  },
  {
    id: "page_languages",
    name: "Seitensprache",
  },
];

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  page_languages: string[];
  official: boolean;
};

const resultFieldLocalMapping: {
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

const defaultState = {
  query: "",
  updateQuery: (newQuery: string) => {},
  locale: "de",
  response: {},
  onSerpClick: (docId: string) => {},
  isSearching: false,
  activeValFilters: {} as ActiveValFilters,
  onResetFacetByKey: (key: string) => {},
  onValueFacetClick: (key: string, value: string) => {},
  onReset: () => {},
  searchResults: [] as SearchResult[],
  totalHits: 0,
};

const SearchContext = createContext(defaultState);

export const performSearch = (
  client: any,
  query: string,
  activeValFilters: ActiveValFilters,
  locale: string
) => {
  const transaction = Sentry.startTransaction({
    name: "search",
    description: "searchInAppSearch",
    data: {
      query,
      activeValFilters,
      locale,
    },
  });
  const searchPromise = client.search(query, {
    facets: {
      intents_who: {
        type: "value",
        size: 10,
      },
      intents_level_one: {
        type: "value",
        size: 20,
      },
      intents_level_two: {
        type: "value",
        size: 20,
      },
      region_country_city: {
        type: "value",
        size: 20,
      },
      page_languages: {
        type: "value",
        size: 10,
      },
    },
    page: {
      size: 25,
    },
    filters: {
      all: chain(
        (k) => map((v) => ({ [k]: v }), activeValFilters[k]),
        keysIn(activeValFilters)
      ),
    },
    analytics: {
      tags: generateAnalyticsTags(activeValFilters, locale),
    },
    result_fields: getResultFieldsByLocale(locale),
    precision: 3,
  });
  searchPromise
    .then(
      (res: any) => {
        transaction.setStatus("success");
      },
      (err: any) => {
        transaction.setStatus("failure");
        Sentry.captureException(err);
      }
    )
    .finally(() => {
      transaction.finish();
    });
  return searchPromise;
};

export const generateAnalyticsTags: (
  activeValFilters: ActiveValFilters,
  locale: string
) => string[] = (activeValFilters, lang) =>
  process.env.NODE_ENV === "production"
    ? [
        "ukraine-hilfe-sachsen",
        ...chain((k: string) => {
          return map(
            (v) =>
              `filter_${k}_${v
                .toLowerCase()
                .replace(/\s/g, "_")
                .replace(/[^a-z0-9]/g, "")}`,
            activeValFilters[k]
          );
        }, keysIn(activeValFilters)),
        "uhs-lang-" + lang,
      ]
    : ["uhs-dev"];

export type ActiveValFilters = { [facetKey: string]: string[] };
export type UrlParsedValues = { [key: string]: string | string[] | undefined };

export const parseActiveValFiltersFromQuery: (
  query: UrlParsedValues
) => ActiveValFilters = (query) => {
  const relevantKeys: string[] = filter(
    (x: string) => x.startsWith("valfilter.") && query[x] !== "",
    keysIn(query)
  );
  const facets: ActiveValFilters = map((v: string | string[] | undefined) => {
    return v ? (Array.isArray(v) ? v : v.split(",")) : [];
  }, pick(relevantKeys, query));
  const renamedFacets: ActiveValFilters = {
    ...renameKeysWith((k: string) => k.replace("valfilter.", ""), facets),
  };
  return renamedFacets;
};

export const facetsToQuery: (facets: ActiveValFilters) => {
  [key: string]: string;
} = (facets) => {
  const relevantKeys = filter(
    (x: string) => facets[x] && isNonEmptyArray(facets[x]),
    keysIn(facets)
  );
  const query: { [key: string]: string } = mergeAll(
    map((k: string) => {
      return { [`valfilter.${k}`]: facets[k].join(",") };
    }, relevantKeys)
  );
  return query;
};

const parseSearchResults = (response: any, locale: string) => {
  return map<object, SearchResult>(
    (hit: object) => ({
      id: pathOr("", ["data", "id", "raw"], hit),
      title: pathOr(
        "",
        [
          "data",
          resultFieldLocalMapping[locale]?.title || "title_de",
          "snippet",
        ],
        hit
      ),
      description: pathOr(
        "",
        [
          "data",
          resultFieldLocalMapping[locale]?.description || "description_de",
          "snippet",
        ],
        hit
      ),
      url: pathOr("", ["data", "url", "raw"], hit),
      page_languages: pathOr([], ["data", "page_languages", "raw"], hit),
      official:
        pathOr<string>("false", ["data", "official", "raw"], hit) === "true",
    }),
    propOr<object[], string, any>([], "results", response)
  );
};

export const SearchContextProvider: React.FC<{
  defaultQuery: string;
  defaultActiveValFilters: ActiveValFilters;
  defaultResponse: any;
}> = ({ defaultQuery, defaultResponse, defaultActiveValFilters, children }) => {
  const client = getClient();
  const { locale, pathname, push } = useRouter();
  const [response, setResponse] = useState<any>(defaultResponse);
  const [query, setQuery] = useState(defaultQuery);
  const [activeValFilters, setActiveValFilters] = useState<ActiveValFilters>(
    defaultActiveValFilters
  );
  const [isSearching, setIsSearching] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>(
    parseSearchResults(defaultResponse, locale || "de")
  );
  const [totalHits, setTotalHits] = useState(
    pathOr(0, ["info", "meta", "page", "total_results"], defaultResponse)
  );

  const updateQuery = (newQuery: string) => {
    const newQueryObj = { q: newQuery };
    setQuery(newQuery);
    setIsSearching(true);
    push(
      { pathname, query: isEmptyString(newQuery) ? {} : newQueryObj },
      undefined,
      {
        locale,
        scroll: true,
      }
    );
  };

  useEffect(() => {
    setQuery(defaultQuery);
    setActiveValFilters(defaultActiveValFilters);
    setResponse(defaultResponse);
    setSearchResults(parseSearchResults(defaultResponse, locale || "de"));
    setTotalHits(
      pathOr(0, ["info", "meta", "page", "total_results"], defaultResponse)
    );
    setIsSearching(false);
  }, [defaultQuery, defaultResponse, defaultActiveValFilters]);

  const onResetFacetByKey = (key: string) => {
    const newActiveValFilters = {
      ...activeValFilters,
      [key]: [],
    };
    setActiveValFilters(newActiveValFilters);
    setIsSearching(true);
    push(
      {
        pathname,
        query: {
          ...(isEmptyString(query) ? {} : { q: query }),
          ...facetsToQuery(newActiveValFilters),
        },
      },
      undefined,
      {
        locale,
        scroll: false,
      }
    );
  };

  const onValueFacetClick = (key: string, value: string) => {
    // newActiveValFilters is a copy of activeValFilters, where either the value is dropped or added, based
    // on whether it is already present in the array
    const newActiveValFilters = {
      ...activeValFilters,
      [key]: activeValFilters[key]
        ? activeValFilters[key].includes(value)
          ? filter((v: string) => v !== value, activeValFilters[key])
          : [...activeValFilters[key], value]
        : [value],
    };
    setActiveValFilters(newActiveValFilters);
    setIsSearching(true);
    push(
      {
        pathname,
        query: {
          ...(isEmptyString(query) ? {} : { q: query }),
          ...facetsToQuery(newActiveValFilters),
        },
      },
      undefined,
      {
        locale,
        scroll: false,
      }
    );
  };

  const onReset = () => {
    setActiveValFilters({});
    setQuery("");
    setIsSearching(true);
    push(
      {
        pathname,
        query: {},
      },
      undefined,
      {
        locale,
        scroll: false,
      }
    );
  };

  const onSerpClick = (docId: string) => {
    client
      .click({
        query,
        requestId: pathOr("-1", ["info", "meta", "request_id"], response),
        documentId: docId,
        tags: generateAnalyticsTags(activeValFilters, locale || "de"),
      })
      .catch((e: any) => {
        console.error("Failed to submit SERP click", e);
      });
  };
  return (
    <SearchContext.Provider
      value={{
        query,
        updateQuery,
        locale: locale || "de",
        response,
        isSearching,
        onSerpClick,
        activeValFilters,
        onResetFacetByKey,
        onValueFacetClick,
        onReset,
        searchResults,
        totalHits,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
