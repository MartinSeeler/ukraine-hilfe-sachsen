import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { FC } from "react";
import SearchInner from "../components/search-inner";
import {
  getClient,
  parseActiveValFiltersFromQuery,
  performSearch,
  SearchContextProvider,
} from "../context/search-context";

export const config = {
  amp: "hybrid",
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  res,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=7200"
  );
  const i18next = await serverSideTranslations(locale || "de", ["translation"]);
  const client = getClient();
  const activeValFilters = parseActiveValFiltersFromQuery(query);
  const response = await performSearch(
    client,
    (query.q || "") as string,
    activeValFilters,
    locale || "de"
  );
  // console.log(response.results[0]);
  return {
    props: {
      ...i18next,
      activeValFilters,
      q: query.q || ("" as string),
      response: JSON.parse(JSON.stringify(response || {})),
    },
  };
};

const Search: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  return (
    <SearchContextProvider
      defaultQuery={props.q || ""}
      defaultActiveValFilters={props.activeValFilters || {}}
      defaultResponse={props.response}
    >
      <SearchInner />
    </SearchContextProvider>
  );
};

export default Search;
