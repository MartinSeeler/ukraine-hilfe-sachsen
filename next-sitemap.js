/** @type {import('next-sitemap').IConfig} */

const redirects = require("./test.json");

module.exports = {
  siteUrl: "https://www.ukraine-hilfe-sachsen.info",
  generateRobotsTxt: true, // (optional)
  hrefIsAbsolute: false,
  additionalPaths: async (config) =>
    redirects.map((red) => ({
      loc: red.source_de,
      locale: "de",
      hreflang: "de",
      hrefIsAbsolute: true,
      changefreq: "daily",
      priority: 0.5,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          locale: "en",
          hreflang: "en",
          href: red.source_en,
          hrefIsAbsolute: true,
        },
        {
          locale: "uk",
          hreflang: "uk",

          href: red.source_uk,
          hrefIsAbsolute: true,
        },
        {
          locale: "ru",
          hreflang: "ru",

          href: red.source_ru,
          hrefIsAbsolute: true,
        },
      ],
    })),
  alternateRefs: [
    {
      href: "https://www.ukraine-hilfe-sachsen.info/en",
      hreflang: "en",
    },
    {
      href: "https://www.ukraine-hilfe-sachsen.info/uk",
      hreflang: "uk",
    },
    {
      href: "https://www.ukraine-hilfe-sachsen.info/ru",
      hreflang: "ru",
    },
  ],
  // ...other options
};
