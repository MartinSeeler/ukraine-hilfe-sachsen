/** @type {import('next-sitemap').IConfig} */

const redirects = require("./test.json");

const siteUrl = "https://www.ukraine-hilfe-sachsen.info";

module.exports = {
  siteUrl,
  generateRobotsTxt: true, // (optional)
  hrefIsAbsolute: false,
  autoLastmod: false,
  additionalPaths: async (config) =>
    redirects.map((red) => ({
      loc: red.source_de,
      // locale: "de",
      hreflang: "de",
      hrefIsAbsolute: true,
      changefreq: "daily",
      priority: 0.5,
      // lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          locale: "en",
          hreflang: "en",
          href: siteUrl + red.source_en,
          hrefIsAbsolute: true,
        },
        {
          locale: "uk",
          hreflang: "uk",

          href: siteUrl + red.source_uk,
          hrefIsAbsolute: true,
        },
        {
          locale: "ru",
          hreflang: "ru",

          href: siteUrl + red.source_ru,
          hrefIsAbsolute: true,
        },
      ],
    })),
  alternateRefs: [
    {
      href: siteUrl + "/en",
      hreflang: "en",
    },
    {
      href: siteUrl + "/uk",
      hreflang: "uk",
    },
    {
      href: siteUrl + "/ru",
      hreflang: "ru",
    },
  ],
  // ...other options
};
