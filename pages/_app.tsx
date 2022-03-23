import "../styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
import { NextQueryParamProvider } from "next-query-params";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextQueryParamProvider>
      <Component {...pageProps} />
    </NextQueryParamProvider>
  );
}
export default appWithTranslation(MyApp, nextI18NextConfig);
