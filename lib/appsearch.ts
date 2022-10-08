import { Client } from "@elastic/enterprise-search";

export const getClient = () =>
  new Client({
    url: "https://my-deployment-68ff1c.ent.europe-west3.gcp.cloud.es.io",
    auth: {
      token: "search-ycf9f6qz3944w8wbdq122b3v",
    },
  });
