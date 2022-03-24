import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
// @ts-ignore
import * as ElasticAppSearch from "@elastic/app-search-javascript";
import { pathOr, propOr } from "ramda";

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
  isSearching: false,
};

const SearchContext = createContext(defaultState);

export const performSearch = (client: any, query: string) => {
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

export const SearchContextProvider: React.FC<{
  defaultQuery: string;
  defaultResponse: any;
}> = ({ defaultQuery, defaultResponse, children }) => {
  const client = ElasticAppSearch.createClient({
    searchKey: "search-ycf9f6qz3944w8wbdq122b3v",
    endpointBase:
      "https://my-deployment-68ff1c.ent.europe-west3.gcp.cloud.es.io",
    engineName: "ukraine-help",
  });
  const { locale, pathname, query: urlQuery, push } = useRouter();

  const [response, setResponse] = useState<any>(defaultResponse);

  const [query, setQuery] = useState(defaultQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [initComplete, setInitComplete] = useState(false);

  const updateQuery = (newQuery: string) => {
    push({ pathname, query: { q: newQuery } }, undefined, {
      locale,
      scroll: true,
    });
  };

  useEffect(() => {
    console.log("searchParamsChanged", { locale, urlQuery });
    const newQuery: string = propOr("", "q", urlQuery);
    setQuery(newQuery);
    if (initComplete) {
      setIsSearching(true);
      performSearch(client, newQuery)
        .then((resp: any) => {
          console.log(resp);
          setResponse(resp);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setInitComplete(true);
    }
  }, [locale, urlQuery]);

  return (
    <SearchContext.Provider
      value={{
        query,
        updateQuery,
        locale: locale || "de",
        response,
        isSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
