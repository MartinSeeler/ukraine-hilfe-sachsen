module.exports = {
  i18n: {
    locales: ["de", "en", "ru", "uk"],
    defaultLocale: "de",
  },
  backend: {
    projectId: process.env.LOCIZE_PID || "",
    // apiKey: 'myApiKey', // to not add the api-key in production, used for saveMissing feature
    referenceLng: "de",
  },
  use: [require("i18next-locize-backend/cjs")],
  serializeConfig: false, // because of the custom use i18next plugin
  debug: false, //process.env.NODE_ENV === "development",
  fallbackLng: "de",
  saveMissing: false, // process.env.NODE_ENV === "development",
  keySeparator: undefined,
  defaultNS: "translation",
  supportedLngs: ["de", "en", "uk", "ru"],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  // debug: true,
  // saveMissing: true, // to not saveMissing to true for production
};
