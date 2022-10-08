import { Client } from "@elastic/enterprise-search";
import { filter, keysIn, map, chain, pathOr, uniq } from "ramda";
import { ActiveValFilters, SearchResult } from "./types";
import * as Sentry from "@sentry/react";
import { SearchResponse } from "@elastic/enterprise-search/lib/api/app/types";

export const client: Client = new Client({
  url: "https://my-deployment-68ff1c.ent.europe-west3.gcp.cloud.es.io",
  auth: {
    token: "search-ycf9f6qz3944w8wbdq122b3v",
  },
});

export const onSerpClick = (
  query: string,
  activeValFilters: ActiveValFilters,
  locale: string,
  docId: string,
  reqId: string
) => {
  client.app
    .logClickthrough({
      engine_name: "ukr-crawl-v2",
      body: {
        query: "",
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
  return searchPromise.then((resp) => parseSearchResults(resp, locale));
};

const parseSearchResults = (response: SearchResponse, locale: string) => {
  return map<object, SearchResult>(
    (hit: object) => ({
      id: pathOr("", ["id", "raw"], hit),
      title: pathOr(
        "",
        [resultFieldLocalMapping[locale]?.title || "title_de", "snippet"],
        hit
      ),
      description: pathOr(
        "",
        [
          resultFieldLocalMapping[locale]?.description || "description_de",
          "snippet",
        ],
        hit
      ),
      tags: pathOr([], ["what", "raw"], hit),
      region: uniq(
        filter(
          (x) => x !== "Sachsen" && x !== "Deutschland",
          [
            ...pathOr([], ["region", "raw"], hit),
            ...pathOr([], ["region_country_city", "raw"], hit),
          ]
        )
      ),
      url: pathOr("", ["url", "raw"], hit),
      page_languages: pathOr([], ["page_languages", "raw"], hit),
      official: pathOr<string>("false", ["official", "raw"], hit) === "true",
      document: pathOr<string>("false", ["document", "raw"], hit) === "true",
    }),
    response.results
  );
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

const resultFieldLocalMapping: {
  [locale: string]: { title: string; description: string };
} = {
  de: {
    title: "title_de",
    description: "description_de",
  },
  en: {
    title: "title_en",
    description: "description_en",
  },
  ru: {
    title: "title_ru",
    description: "description_ru",
  },
  uk: {
    title: "title_uk",
    description: "description_ua",
  },
};

export const getResultFieldsByLocale = (locale: string) => ({
  id: {
    raw: {},
  },
  page_languages: {
    raw: {},
  },
  url: {
    raw: {},
  },
  official: {
    raw: {},
  },
  region: {
    raw: {},
  },
  document: {
    raw: {},
  },
  region_country_city: {
    raw: {},
  },
  what: {
    raw: {},
  },
  [resultFieldLocalMapping[locale]?.title || "title_de"]: {
    snippet: {
      size: 256,
      fallback: true,
    },
  },
  [resultFieldLocalMapping[locale]?.description || "description_de"]: {
    snippet: {
      size: 256,
      fallback: true,
    },
  },
});
