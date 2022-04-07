import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";
import { filter, join, pathOr } from "ramda";
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
    text: "Ukraine Hilfe Sachsen - Hilfe für die Ukraine",
  },
  {
    key: "seo_desc_who",
    text: "Hilfreiche Links für $t(facet_who_value_{{who}})",
  },
  {
    key: "seo_desc_region",
    text: "Hilfreiche Links für die Region $t(facet_region_country_city_value_{{region}})",
  },
  {
    key: "seo_desc_what",
    text: "Hilfreiche Links zum Thema $t(facet_what_value_{{what}})",
  },
  {
    key: "seo_desc_region_who",
    text: "Hilfreiche Links für $t(facet_who_value_{{who}}) in der Region $t(facet_region_country_city_value_{{region}})",
  },
  {
    key: "seo_desc_region_what",
    text: "Hilfreiche Links zum Thema $t(facet_what_value_{{what}}) in der Region $t(facet_region_country_city_value_{{region}})",
  },
  {
    key: "seo_desc_region_who_what",
    text: "Hilfreiche Links zum Thema $t(facet_what_value_{{what}}) für $t(facet_who_value_{{who}}) in der Region $t(facet_region_country_city_value_{{region}})",
  },
  {
    key: "seo_desc_who_what",
    text: "Hilfreiche Links zum Thema $t(facet_what_value_{{what}}) für $t(facet_who_value_{{who}})",
  },
];

const getSeoTextOption: (
  selectedRegion: string | undefined,
  selectedWhat: string | undefined,
  selectedWho: string | undefined
) => SeoTextOption = (selectedRegion, selectedWhat, selectedWho) => {
  if (selectedRegion && selectedWhat && selectedWho) {
    return seoDescOptions[6];
  }
  if (selectedRegion) {
    if (selectedWho) {
      return seoDescOptions[4];
    } else if (selectedWhat) {
      return seoDescOptions[5];
    }
    return seoDescOptions[2];
  } else if (selectedWhat) {
    if (selectedWho) {
      return seoDescOptions[7];
    }
    return seoDescOptions[3];
  } else if (selectedWho) {
    return seoDescOptions[1];
  }
  return seoDescOptions[0];
};

const buildCanonicalUrlPostfix = (
  selectedRegion: string | undefined,
  selectedWhat: string | undefined,
  selectedWho: string | undefined,
  query: string
) => {
  return (
    "?" +
    join(
      "&",
      filter(
        (x: string) => !isEmptyString(x),
        [
          isEmptyString(query) ? "" : `q=${encodeURIComponent(query)}`,
          selectedWho ? `f.who=${encodeURIComponent(selectedWho)}` : "",
          selectedRegion
            ? `f.region_country_city=${encodeURIComponent(selectedRegion)}`
            : "",
          selectedWhat ? `f.what=${encodeURIComponent(selectedWhat)}` : "",
        ]
      )
    )
  );
};

const SocialSeoTags: FC = () => {
  const router = useRouter();
  const { query, selectedWhat, selectedWho, selectedRegion, response } =
    useContext(SearchContext);
  const [totalHits, setTotalHits] = useState(
    pathOr(0, ["info", "meta", "page", "total_results"], response)
  );

  const { t } = useTranslation();

  const [url, setUrl] = useState(
    () =>
      "https://ukraine-hilfe-sachsen.info" +
      (router.locale ? "/" + router.locale : "") +
      buildCanonicalUrlPostfix(selectedRegion, selectedWhat, selectedWho, query)
  );

  const [description, setDescription] = useState(
    getSeoTextOption(selectedRegion, selectedWhat, selectedWho)
  );

  useEffect(() => {
    setTotalHits(
      pathOr(0, ["info", "meta", "page", "total_results"], response)
    );
    setDescription(getSeoTextOption(selectedRegion, selectedWhat, selectedWho));
    setUrl(
      "https://ukraine-hilfe-sachsen.info" +
        (router.locale ? "/" + router.locale : "") +
        buildCanonicalUrlPostfix(
          selectedRegion,
          selectedWhat,
          selectedWho,
          query
        )
    );
  }, [
    query,
    response,
    selectedRegion,
    selectedWhat,
    selectedWho,
    router.locale,
  ]);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
      <title>
        {`${isEmptyString(query) ? "" : query + " - "}${
          selectedWho
            ? t("facet_who_value_" + selectedWho, selectedWho) + " - "
            : ""
        }${
          selectedRegion
            ? t(
                "facet_region_country_city_value_" + selectedRegion,
                selectedRegion
              ) + " - "
            : ""
        }${
          selectedWhat
            ? t("facet_what_value_" + selectedWhat, selectedWhat) + " - "
            : ""
        }${t("homepage_title", "Ukraine Hilfe Sachsen")}`}
      </title>
      <meta
        property="og:site_name"
        content={t("homepage_title", "Ukraine Hilfe Sachsen")}
      />
      <meta
        name="og:title"
        content={`${isEmptyString(query) ? "" : query + " - "}${
          selectedWho
            ? t("facet_who_value_" + selectedWho, selectedWho) + " - "
            : ""
        }${
          selectedRegion
            ? t(
                "facet_region_country_city_value_" + selectedRegion,
                selectedRegion
              ) + " - "
            : ""
        }${
          selectedWhat
            ? t("facet_what_value_" + selectedWhat, selectedWhat) + " - "
            : ""
        }${t("homepage_title", "Ukraine Hilfe Sachsen")}`}
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
        content={`${isEmptyString(query) ? "" : query + " - "}${
          selectedWho
            ? t("facet_who_value_" + selectedWho, selectedWho) + " - "
            : ""
        }${
          selectedRegion
            ? t(
                "facet_region_country_city_value_" + selectedRegion,
                selectedRegion
              ) + " - "
            : ""
        }${
          selectedWhat
            ? t("facet_what_value_" + selectedWhat, selectedWhat) + " - "
            : ""
        }${t("homepage_title", "Ukraine Hilfe Sachsen")}`}
      />
      <meta
        name="twitter:label1"
        content={t("search_hits", "Anzahl an Links")}
      />
      <meta name="twitter:data1" content={totalHits.toString()} />
      <meta
        name="description"
        content={t(description.key, description.text, {
          total_hits: totalHits,
          region: selectedRegion,
          what: selectedWhat,
          who: selectedWho,
        })}
      />
      <meta
        name="twitter:description"
        content={t(description.key, description.text, {
          total_hits: totalHits,
          region: selectedRegion,
          what: selectedWhat,
          who: selectedWho,
        })}
      />
      <meta
        name="og:description"
        content={t(description.key, description.text, {
          total_hits: totalHits,
          region: selectedRegion,
          what: selectedWhat,
          who: selectedWho,
        })}
      />
      <link rel="canonical" href={url} />
      <meta name="twitter:url" content={url} />
      <meta name="og:url" content={url} />
    </Head>
  );
};

export default SocialSeoTags;
