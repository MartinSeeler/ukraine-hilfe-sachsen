import { StringParam, useQueryParam, withDefault } from "next-query-params";
import { useRouter } from "next/router";
import React, { createContext } from "react";

const defaultState = {
  query: "",
  updateQuery: (newQuery: string) => {},
  locale: "de",
};

const SearchContext = createContext(defaultState);

export const SearchContextProvider: React.FC<{ defaultQuery: string }> = ({
  defaultQuery,
  children,
}) => {
  const { locale } = useRouter();

  const [query, setQuery] = useQueryParam(
    "q",
    withDefault(StringParam, defaultQuery)
  );

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        updateQuery,
        locale: locale || "de",
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
