import { parseLocaleFromQuery } from "../../lib/search";
import type { NextApiRequest, NextApiResponse } from "next";
import { performSearch } from "../../lib/appsearch";
import {
  parseActiveValFiltersFromQuery,
  parseQueryStringFromQuery,
} from "../../lib/search";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = parseQueryStringFromQuery(req.query);
  const activeValFilters = parseActiveValFiltersFromQuery(req.query);
  const locale = parseLocaleFromQuery(req.query);
  const response = await performSearch(query, activeValFilters, locale);
  console.log(response);
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=7200"
  );
  res.status(200).json(response);
}
