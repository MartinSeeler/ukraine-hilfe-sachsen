// /pages/_middleware.ts
import { makeMiddleware } from "qs-props";

export const middleware = makeMiddleware({
  keys: ["q"],
  activeWhen: (req) => !req.url.includes("q="),
});
