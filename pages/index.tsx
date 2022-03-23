import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { FC } from "react";
import SearchInner from "../components/search-inner";
import {
  performSearch,
  SearchContextProvider,
} from "../context/search-context";
// @ts-ignore
import * as ElasticAppSearch from "@elastic/app-search-javascript";
import { pathOr } from "ramda";

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const i18next = await serverSideTranslations(locale || "de", ["translation"]);
  console.log("getServerSideProps", { locale, query });
  const client = ElasticAppSearch.createClient({
    searchKey: "search-ycf9f6qz3944w8wbdq122b3v",
    endpointBase:
      "https://my-deployment-68ff1c.ent.europe-west3.gcp.cloud.es.io",
    engineName: "ukraine-help",
  });
  const response = await performSearch(client, (query.q || "") as string);
  // console.log(
  //   "hits total",
  //   pathOr(0, ["info", "meta", "page", "total_results"], response)
  // );
  return {
    props: {
      ...i18next,
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
      defaultResponse={props.response}
    >
      <SearchInner />
    </SearchContextProvider>
  );
};

export default Search;
