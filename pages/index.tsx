import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { qs } from "qs-props";
import { FC } from "react";
import SearchInner from "../components/search-inner";
import { SearchContextProvider } from "../context/search-context";

const { getQueryStringProps } = qs(["q"] as const, "queries");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const i18next = await serverSideTranslations(ctx.locale || "de", [
    "translation",
  ]);
  const props = getQueryStringProps(ctx);
  return {
    props: { ...i18next, ...props },
  };
};

const Search: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  return (
    <SearchContextProvider defaultQuery={props.q || ""}>
      <SearchInner />
    </SearchContextProvider>
  );
};

export default Search;
