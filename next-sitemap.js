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
        alternateRefs: [
          {
            locale: "en",
            hreflang: "en",
            changefreq: "daily",
            href: "/dresden-informations",
            hrefIsAbsolute: true,
          },
        ],
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
