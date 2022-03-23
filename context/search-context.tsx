import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
// @ts-ignore
import * as ElasticAppSearch from "@elastic/app-search-javascript";

const defaultState = {
  query: "",
  updateQuery: (newQuery: string) => {},
  locale: "de",
  response: {},
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
  const { locale } = useRouter();

  const [response, setResponse] = useState<any>(defaultResponse);

  const [query, setQuery] = useState(defaultQuery);

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  useEffect(() => {
    performSearch(client, query).then((resp: any) => {
      console.log(resp);
      setResponse(resp);
    });
  }, [query]);

  return (
    <SearchContext.Provider
      value={{
        query,
        updateQuery,
        locale: locale || "de",
        response,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
