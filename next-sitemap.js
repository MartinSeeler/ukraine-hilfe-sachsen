/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://www.ukraine-hilfe-sachsen.info",
  generateRobotsTxt: true, // (optional)
  hrefIsAbsolute: false,
  additionalPaths: async (config) => [
    await config.transform(
      {
        locale: "de",
        hreflang: "de",
        changefreq: "daily",
        priority: "0.5",
      },
      "/dresden-informationen"
    ),
    await config.transform(
      {
        locale: "en",
        hreflang: "en",
        alternateRefs: config.alternateRefs,
        changefreq: "daily",
        priority: "0.5",
      },
      "/dresden-informationen"
    ),
  ],
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
