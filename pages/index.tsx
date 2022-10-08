import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, InferGetServerSidePropsType } from "next/types";
import { FC } from "react";
import SearchInner from "../components/search-inner";
import { SearchContextProvider } from "../context/search-context";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "de", ["translation"])),
    },
  };
};

const Search: FC<InferGetServerSidePropsType<typeof getStaticProps>> = () => {
  return (
    <SearchContextProvider>
      <SearchInner />
    </SearchContextProvider>
  );
};

export default Search;
