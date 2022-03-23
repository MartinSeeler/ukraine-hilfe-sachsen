import { useTranslation } from "next-i18next";
import Head from "next/head";
import { pathOr } from "ramda";
import React, { FC, useContext, useEffect, useState } from "react";
import SearchContext from "../context/search-context";

const SocialSeoTags: FC = () => {
  const { query, response } = useContext(SearchContext);
  const [totalHits, setTotalHits] = useState(0);
  useEffect(() => {
    setTotalHits(
      pathOr(0, ["info", "meta", "page", "total_results"], response)
    );
  }, [response]);
  const { t } = useTranslation();
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <title>
        {query !== ""
          ? `${query} - ${t("homepage_title", "Ukraine Hilfe Sachsen")}`
          : t("homepage_title", "Ukraine Hilfe Sachsen")}
      </title>
      <meta name="og:url" content="https://ukraine-hilfe-sachsen.info/" />
      <meta
        name="og:title"
        content={t("homepage_title", "Ukraine Hilfe Sachsen")}
      />
      <meta
        name="og:image"
        content="https://images.unsplash.com/photo-1587027066597-e9b5dea8cbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d3x8fHx8fDE2NDcxMDM2NTk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=640"
      />
      <meta
        name="twitter:image"
        content="https://images.unsplash.com/photo-1587027066597-e9b5dea8cbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d3x8fHx8fDE2NDcxMDM2NTk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=640"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@avantgardelabs" />
      <meta name="twitter:domain" content="ukraine-hilfe-sachsen.info" />
      <meta
        name="twitter:title"
        content={t("homepage_title", "Ukraine Hilfe Sachsen")}
      />
      <meta
        name="twitter:label1"
        content={t("search_hits", "Anzahl an Links")}
      />
      <meta name="twitter:data1" content={totalHits.toString()} />
      <meta
        property="og:site_name"
        content={
          query !== ""
            ? `${query} - ${t("homepage_title", "Ukraine Hilfe Sachsen")}`
            : t("homepage_title", "Ukraine Hilfe Sachsen")
        }
      />
      <meta
        name="description"
        content={
          query !== ""
            ? t(
                "search_description",
                "Wir haben {{hits_count}} hilfreiche Links für die Suche nach {{query}} in unserer Datenbank gefunden.",
                {
                  hits_count: totalHits,
                  query,
                }
              )
            : t("homepage_subtitle", "Lorem ipsum ich bin ein Sub Title")
        }
      />
      <meta
        name="twitter:description"
        content={
          query !== ""
            ? t(
                "search_description",
                "Wir haben {{hits_count}} hilfreiche Links für die Suche nach {{query}} in unserer Datenbank gefunden.",
                {
                  hits_count: totalHits,
                  query,
                }
              )
            : t("homepage_subtitle", "Lorem ipsum ich bin ein Sub Title")
        }
      />
      <meta
        name="og:description"
        content={
          query !== ""
            ? t(
                "search_description",
                "Wir haben {{hits_count}} hilfreiche Links für die Suche nach {{query}} in unserer Datenbank gefunden.",
                {
                  hits_count: totalHits,
                  query,
                }
              )
            : t("homepage_subtitle", "Lorem ipsum ich bin ein Sub Title")
        }
      />
      <link rel="canonical" href="https://ukraine-hilfe-sachsen.info/" />
      <meta name="twitter:url" content="https://ukraine-hilfe-sachsen.info/" />
    </Head>
  );
};

export default SocialSeoTags;
