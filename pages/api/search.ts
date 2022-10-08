import Client from "@elastic/enterprise-search/lib";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const client = new Client({
    url: "https://my-deployment-68ff1c.ent.europe-west3.gcp.cloud.es.io",
    auth: {
      token: "search-ycf9f6qz3944w8wbdq122b3v",
    },
  });
  const response = await client.app.search({
    engine_name: "ukr-crawl-v2",
    body: {
      query: "Betten",
    },
  });
  console.log(response);
  client.close();
  res.status(200).json(response);
}
