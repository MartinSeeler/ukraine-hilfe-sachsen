// @ts-ignore
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { filter, path, pathOr } from "ramda";
import { isEmptyString } from "ramda-adjunct";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { ActiveValFilters, SearchResult } from "../lib/types";
import {
  parseActiveValFiltersFromQuery,
  facetsToQuery,
  parseQueryStringFromQuery,
  parseSearchResults,
} from "../lib/search";
import { SearchResponse } from "@elastic/enterprise-search/lib/api/app/types";

const defaultState = {
  query: "",
  response: undefined as SearchResponse | undefined,
  activeValFilters: {} as ActiveValFilters,
  updateQuery: (newQuery: string) => {},
  onResetFacetByKey: (facetKey: string) => {},
  locale: "de",
  isSearching: false,
  onValueFacetClick: (facetKey: string, facetValue: string) => {},
  onReset: () => {},
  searchResults: [] as SearchResult[],
  totalHits: 0,
  selectedRegion: "" as string | undefined,
  selectedWho: "" as string | undefined,
  selectedWhat: "" as string | undefined,
};

const SearchContext = createContext(defaultState);

const searchParamsToQueryString = (
  query: string,
  activeValFilters: ActiveValFilters,
  locale: string
) => {
  const facets = facetsToQuery(activeValFilters);
  return `?q=${query}&${new URLSearchParams(facets).toString()}&l=${locale}`;
};

export const SearchContextProvider: React.FC = ({ children }) => {
  const { locale, query, pathname, push } = useRouter();
  const [userquery, setQuery] = useState(parseQueryStringFromQuery(query));
  const [activeValFilters, setActiveValFilters] = useState<ActiveValFilters>(
    () => parseActiveValFiltersFromQuery(query)
  );

  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    path(["region_country_city", 0], activeValFilters)
  );
  const [selectedWho, setSelectedWho] = useState<string | undefined>(
    path(["who", 0], activeValFilters)
  );
  const [selectedWhat, setSelectedWhat] = useState<string | undefined>(
    path(["what", 0], activeValFilters)
  );

  useEffect(() => {
    setQuery(parseQueryStringFromQuery(query));
    const newActiveValFilters = parseActiveValFiltersFromQuery(query);
    setActiveValFilters(newActiveValFilters);
    setSelectedWho(path(["who", 0], newActiveValFilters));
    setSelectedWhat(path(["what", 0], newActiveValFilters));
    setSelectedRegion(path(["region_country_city", 0], newActiveValFilters));
  }, [query]);

  const { data, isValidating } = useSWR<SearchResponse>(
    `/api/search${searchParamsToQueryString(
      userquery,
      activeValFilters,
      locale || "de"
    )}`,
    fetcher
  );

  useEffect(() => {
    console.log("Response", data);
    if (data) {
      setSearchResults(parseSearchResults(data, locale || "de"));
      setTotalHits(data.meta.page.total_results);
    }
  }, [data]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalHits, setTotalHits] = useState(0);

  const updateQuery = (newQuery: string) => {
    const newQueryObj = isEmptyString(newQuery) ? {} : { q: newQuery };
    setQuery(newQuery);
    push(
      {
        pathname,
        query: { ...newQueryObj, ...facetsToQuery(activeValFilters) },
      },
      undefined,
      {
        locale,
        scroll: true,
      }
    );
  };

  const onResetFacetByKey = (key: string) => {
    const newActiveValFilters = {
      ...activeValFilters,
      [key]: [],
    };
    setActiveValFilters(newActiveValFilters);
    push(
      {
        pathname,
        query: {
          ...(isEmptyString(query) ? {} : { q: query }),
          ...facetsToQuery(newActiveValFilters),
        } as ParsedUrlQueryInput,
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
    push(
      {
        pathname,
        query: {
          ...(isEmptyString(query) ? {} : { q: query }),
          ...facetsToQuery(newActiveValFilters),
        } as ParsedUrlQueryInput,
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

  return (
    <SearchContext.Provider
      value={{
        response: data,
        query: userquery,
        updateQuery,
        locale: locale || "de",
        isSearching: isValidating,
        activeValFilters,
        onResetFacetByKey,
        onValueFacetClick,
        onReset,
        searchResults,
        totalHits,
        selectedRegion,
        selectedWho,
        selectedWhat,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
