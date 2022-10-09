import { Client } from "@elastic/enterprise-search";
import { keysIn, map, chain } from "ramda";
import { ActiveValFilters } from "./types";
import * as Sentry from "@sentry/react";
import { getResultFieldsByLocale, resultFieldLocalMapping } from "./search";

export const client: Client = new Client({
  url: "https://my-deployment-68ff1c.ent.europe-west3.gcp.cloud.es.io",
  auth: {
    token: "search-ycf9f6qz3944w8wbdq122b3v",
  },
});

export const logClickthrough = async (
  query: string,
  activeValFilters: ActiveValFilters,
  locale: string,
  docId: string,
  reqId: string
) => {
  return client.app
    .logClickthrough({
      engine_name: "ukr-crawl-v2",
      body: {
        query,
        document_id: docId,
        request_id: reqId,
        tags: generateAnalyticsTags(activeValFilters, locale),
      },
    })
    .catch((e: any) => {
      Sentry.captureException(e);
      console.error("Failed to submit SERP click", e);
    });
};

export const performSearch = (
  query: string,
  activeValFilters: ActiveValFilters,
  locale: string
) => {
  const transaction = Sentry.startTransaction({
    name: "search",
    description: "searchInAppSearch",
    data: {
      query,
      activeValFilters,
      locale,
    },
  });
  const searchPromise = client.app.search({
    engine_name: "ukr-crawl-v2",
    body: {
      // @ts-ignore
      precision: 3,
      query,
      facets: {
        who: {
          type: "value",
          size: 10,
        },
        what: {
          type: "value",
          size: 40,
        },
        region_country_city: {
          type: "value",
          size: 100,
        },
      },
      page: {
        size: 100,
      },
      sort: [
        {
          _score: "desc",
        },
        {
          [resultFieldLocalMapping[locale]?.title || "title_de"]: "asc",
        },
      ],
      filters: {
        all: chain(
          (k) => map((v) => ({ [k]: v }), activeValFilters[k]),
          keysIn(activeValFilters)
        ),
      },
      analytics: {
        tags: generateAnalyticsTags(activeValFilters, locale),
      },
      result_fields: getResultFieldsByLocale(locale),
    },
  });
  searchPromise
    .then(
      (_) => {
        transaction.setStatus("success");
      },
      (err: any) => {
        transaction.setStatus("failure");
        Sentry.captureException(err);
      }
    )
    .finally(() => {
      transaction.finish();
    });
  return searchPromise;
};

/**
 * It takes an object of active filters and a locale and returns an array of strings
 * @param activeValFilters - This is the object that contains the active filters.
 * @param locale - The language of the page.
 */
const generateAnalyticsTags: (
  activeValFilters: ActiveValFilters,
  locale: string
) => string[] = (activeValFilters, lang) =>
  process.env.NODE_ENV === "production"
    ? [
        "ukraine-hilfe-sachsen",
        ...chain((k: string) => {
          return map(
            (v) =>
              `filter_${k}_${v
                .toLowerCase()
                .replace(/\s/g, "_")
                .replace(/[^a-z0-9]/g, "")}`,
            activeValFilters[k]
          );
        }, keysIn(activeValFilters)),
        "uhs-lang-" + lang,
      ]
    : ["uhs-dev"];
