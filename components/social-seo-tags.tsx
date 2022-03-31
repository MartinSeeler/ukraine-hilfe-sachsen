import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";
import { pathOr } from "ramda";
import { isEmptyString } from "ramda-adjunct";
import React, { FC, useContext, useEffect, useState } from "react";
import SearchContext from "../context/search-context";

type SeoTextOption = {
  key: string;
  text: string;
};

const seoDescOptions = [
  {
    key: "seo_desc_empty",
    text: "{{total_hits}} Ergebnisse gefunden",
  },
  {
    key: "seo_desc_query",
    text: "{{total_hits}} Ergebnisse für die Suche nach '{{query}}'",
  },
  {
    key: "seo_desc_region",
    text: "{{total_hits}} Ergebnisse in {{region}}",
  },
  {
    key: "seo_desc_query_region",
    text: "{{total_hits}} Ergebnisse für die Suche nach '{{query}}' in {{region}}",
  },
];

const getSeoTextOption: (
  query: string,
  currentRegion: string | undefined
) => SeoTextOption = (query, currentRegion) => {
  if (isEmptyString(query)) {
    if (currentRegion) {
      return seoDescOptions[2];
    }
    return seoDescOptions[0];
  } else {
    if (currentRegion) {
      return seoDescOptions[3];
    }
    return seoDescOptions[1];
  }
};

const SocialSeoTags: FC = () => {
  const router = useRouter();
  const { query, currentRegion, response } = useContext(SearchContext);
  const [totalHits, setTotalHits] = useState(
    pathOr(0, ["info", "meta", "page", "total_results"], response)
  );

  const { t } = useTranslation();

  const [description, setDescription] = useState(
    getSeoTextOption(query, currentRegion)
  );

  useEffect(() => {
    setTotalHits(
      pathOr(0, ["info", "meta", "page", "total_results"], response)
    );
    setDescription(getSeoTextOption(query, currentRegion));
    console.log("current_region", currentRegion);
  }, [response, currentRegion]);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
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
        content={t(description.key, description.text, {
          total_hits: totalHits,
          query,
          region: currentRegion,
        })}
      />
      <meta
        name="twitter:description"
        content={t(description.key, description.text, {
          total_hits: totalHits,
          query,
          region: currentRegion,
        })}
      />
      <meta
        name="og:description"
        content={t(description.key, description.text, {
          total_hits: totalHits,
          query,
          region: currentRegion,
        })}
      />
      <link
        rel="canonical"
        href={
          "https://www.ukraine-hilfe-sachsen.info" +
          (router.locale ? "/" + router.locale : "/") +
          router.asPath.replace("/", "")
        }
      />
      <meta name="twitter:url" content="https://ukraine-hilfe-sachsen.info/" />
    </Head>
  );
};

export default SocialSeoTags;
