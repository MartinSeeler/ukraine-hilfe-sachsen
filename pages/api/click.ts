import { parseReqIdFromQuery } from "./../../lib/search";
import { parseDocIdFromQuery, parseLocaleFromQuery } from "../../lib/search";
import type { NextApiRequest, NextApiResponse } from "next";
import { logClickthrough } from "../../lib/appsearch";
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
  const did = parseDocIdFromQuery(req.query);
  const rid = parseReqIdFromQuery(req.query);
  const response = await logClickthrough(
    query,
    activeValFilters,
    locale,
    did,
    rid
  );
  res.status(200).json(response);
}
