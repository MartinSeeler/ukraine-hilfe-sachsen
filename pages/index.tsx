import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
} from "next/types";
import { FC } from "react";
import SearchInner from "../components/search-inner";
import { SearchContextProvider } from "../context/search-context";
import { performSearch } from "../lib/appsearch";
import {
  parseQueryStringFromQuery,
  parseActiveValFiltersFromQuery,
} from "../lib/search";

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  res,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=7200"
  );
  const userquery = parseQueryStringFromQuery(query);
  const activeValFilters = parseActiveValFiltersFromQuery(query);
  const response = await performSearch(
    userquery,
    activeValFilters,
    locale || "de"
  );
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=7200"
  );
  return {
    props: {
      ...(await serverSideTranslations(locale || "de", ["translation"])),
      response,
    },
  };
};

const Search: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  response,
}) => {
  return (
    <SearchContextProvider initialResponse={response}>
      <SearchInner />
    </SearchContextProvider>
  );
};

export default Search;
