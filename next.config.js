// @ts-check

const { i18n } = require("./next-i18next.config");
const { withSentryConfig } = require("@sentry/nextjs");

const redirects = require("./test.json");

/**
 * @type {import("@sentry/nextjs/esm/config/types").ExportedNextConfig}
 */
const nextConfig = {
  i18n,
  async redirects() {
    return [
      ...redirects.map((red) => ({
        source: red.source_de,
        destination: red.destination_de,
        permanent: false,
      })),
      ...redirects.map((red) => ({
        source: red.source_en,
        destination: red.destination_en,
        permanent: false,
      })),
      ...redirects.map((red) => ({
        source: red.source_uk,
        destination: red.destination_uk,
        permanent: false,
      })),
      ...redirects.map((red) => ({
        source: red.source_ru,
        destination: red.destination_ru,
        permanent: false,
      })),
      {
        source: "/dresden-informationen",
        destination: "/?f.region_country_city=Dresden&f.what=Informationen",
        permanent: false,
      },
      {
        source: "/en/dresden-informationen",
        destination: "/en?f.region_country_city=Dresden&f.what=Informationen",
        permanent: false,
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
