module.exports = {
  i18n: {
    locales: ["de", "en", "ru", "uk"],
    defaultLocale: "de",
  },
  backend: {
    projectId: process.env.LOCIZE_PID || "",
    apiKey: process.env.LOCIZE_API_KEY,
    referenceLng: "de",
    allowedAddOrUpdateHosts: ["localhost"],
  },
  locizeLastUsed: {
    // locize project id
    projectId: process.env.LOCIZE_PID || "",
    apiKey: process.env.LOCIZE_API_KEY,
    referenceLng: "de",
    debounceSubmit: 90000,
    allowedHosts: ["localhost"],
  },
  projectId: process.env.LOCIZE_PID || "",
  use: [require("i18next-locize-backend/cjs"), require("locize-lastused/cjs")],
  serializeConfig: false, // because of the custom use i18next plugin
  debug: false, // process.env.NODE_ENV === "development",
  fallbackLng: "de",
  saveMissing: process.env.NODE_ENV === "development",
  keySeparator: undefined,
  defaultNS: "translation",
  supportedLngs: ["de", "en", "uk", "ru"],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  // debug: true,
  // saveMissing: true, // to not saveMissing to true for production
};
