// @ts-check

const { i18n } = require("./next-i18next.config");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  i18n,
  async redirects() {
    return [
      {
        source: "/dresden",
        destination: "/?valfilter.region_country_city=Dresden",
        permanent: false,
      },
    ];
  },
};
module.exports = nextConfig;
