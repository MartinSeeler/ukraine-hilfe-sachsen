// @ts-ignore
import * as ElasticAppSearch from "@elastic/app-search-javascript";
import { useRouter } from "next/router";
import { map, keysIn, filter, pick, mergeAll, propOr, chain } from "ramda";
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

export type SerpHit = {
  data: {
    id: {
      raw: string;
    };
    title_de: {
      snippet: string;
    };
    title_en: {
      snippet: string;
    };
    title_ru: {
      snippet: string;
    };
    title_uk: {
      snippet: string;
    };
    description_de: {
      snippet: string;
    };
    description_en: {
      snippet: string;
    };
    description_ru: {
      snippet: string;
    };
    description_ua: {
      snippet: string;
    };
    page_languages: {
      raw: string[];
    };
    url: {
      raw: string;
    };
  };
};

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
};

const SearchContext = createContext(defaultState);

export const performSearch = (
  client: any,
  query: string,
  activeValFilters: ActiveValFilters
) => {
  console.log("performSearch", query, activeValFilters);
  return client.search(query, {
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
    //   filters: {
    //     all: Object.entries(facets).flatMap(([k, vs]) => {
    //       return vs.map((v) => {
    //         return { [k.replace("valfilter.", "")]: v };
    //       });
    //     }),
    //   },
    //   analytics: {
    //     tags: generateAnalyticsTags(facets, lang),
    //   },
    precision: 3,
  });
};

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

export const SearchContextProvider: React.FC<{
  defaultQuery: string;
  defaultActiveValFilters: ActiveValFilters;
  defaultResponse: any;
}> = ({ defaultQuery, defaultResponse, defaultActiveValFilters, children }) => {
  const client = getClient();
  const { locale, pathname, query: urlQuery, push } = useRouter();
  const [response, setResponse] = useState<any>(defaultResponse);
  const [query, setQuery] = useState(defaultQuery);
  const [activeValFilters, setActiveValFilters] = useState<ActiveValFilters>(
    defaultActiveValFilters
  );
  const [isSearching, setIsSearching] = useState(false);
  const [initComplete, setInitComplete] = useState(false);

  const updateQuery = (newQuery: string) => {
    const newQueryObj = { q: newQuery };
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
    const newQuery: string = propOr("", "q", urlQuery);
    setQuery(newQuery);
    const newActiveValFilters = parseActiveValFiltersFromQuery(urlQuery);
    setActiveValFilters(newActiveValFilters);
    if (initComplete) {
      setIsSearching(true);
      performSearch(client, newQuery, newActiveValFilters)
        .then((resp: any) => {
          setResponse(resp);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setInitComplete(true);
    }
  }, [locale, urlQuery]);

  const onResetFacetByKey = (key: string) => {
    const newActiveValFilters = {
      ...activeValFilters,
      [key]: [],
    };
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
    client;
    //     .click({
    //       query,
    //       requestId,
    //       documentId: entry.data.id.raw,
    //       tags: generateAnalyticsTags(facets, lang),
    //     })
    //     .catch((e: any) => {
    //       console.error("Failed to submit SERP click", e);
    //     });
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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
