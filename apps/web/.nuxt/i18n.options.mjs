
// @ts-nocheck
import locale_vi_46json_88ab357d from "#nuxt-i18n/88ab357d";
import locale_en_46json_6b215f63 from "#nuxt-i18n/6b215f63";

export const localeCodes =  [
  "vi",
  "en"
]

export const localeLoaders = {
  vi: [
    {
      key: "locale_vi_46json_88ab357d",
      load: () => Promise.resolve(locale_vi_46json_88ab357d),
      cache: true
    }
  ],
  en: [
    {
      key: "locale_en_46json_6b215f63",
      load: () => Promise.resolve(locale_en_46json_6b215f63),
      cache: true
    }
  ]
}

export const vueI18nConfigs = []

export const nuxtI18nOptions = {
  restructureDir: false,
  experimental: {
    localeDetector: "",
    switchLocalePathLinkSSR: false,
    autoImportTranslationFunctions: false,
    typedPages: true,
    typedOptionsAndMessages: false,
    generatedLocaleFilePathFormat: "absolute",
    alternateLinkCanonicalQueries: false,
    hmr: true
  },
  bundle: {
    compositionOnly: true,
    runtimeOnly: false,
    fullInstall: true,
    dropMessageCompiler: false,
    optimizeTranslationDirective: false
  },
  compilation: {
    strictMessage: true,
    escapeHtml: false
  },
  customBlocks: {
    defaultSFCLang: "json",
    globalSFCScope: false
  },
  locales: [
    {
      code: "vi",
      language: "vi-VN",
      name: "Tiếng Việt",
      files: [
        {
          path: "/home/app/locales/vi.json",
          cache: undefined
        }
      ]
    },
    {
      code: "en",
      language: "en-US",
      name: "English",
      files: [
        {
          path: "/home/app/locales/en.json",
          cache: undefined
        }
      ]
    }
  ],
  defaultLocale: "vi",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  trailingSlash: false,
  defaultLocaleRouteNameSuffix: "default",
  strategy: "prefix_except_default",
  lazy: false,
  langDir: "locales/",
  rootRedirect: undefined,
  detectBrowserLanguage: {
    alwaysRedirect: false,
    cookieCrossOrigin: false,
    cookieDomain: null,
    cookieKey: "i18n_locale",
    cookieSecure: false,
    fallbackLocale: "vi",
    redirectOn: "root",
    useCookie: true,
    cookieMaxAge: 2592000
  },
  differentDomains: false,
  baseUrl: "",
  customRoutes: "config",
  pages: {
    "san-pham-list": {
      en: "/products",
      vi: "/san-pham-list"
    },
    "san-pham-slug": {
      en: "/products/[slug]",
      vi: "/san-pham/[slug]"
    },
    "dich-vu": {
      en: "/services",
      vi: "/dich-vu"
    },
    "doi-ngu": {
      en: "/team",
      vi: "/doi-ngu"
    },
    "lang-nghe": {
      en: "/craft-village",
      vi: "/lang-nghe"
    },
    gallery: {
      en: "/gallery",
      vi: "/gallery"
    },
    "tin-tuc": {
      en: "/blog",
      vi: "/tin-tuc"
    },
    "tin-tuc-slug": {
      en: "/blog/[slug]",
      vi: "/tin-tuc/[slug]"
    },
    "gio-hang": {
      en: "/cart",
      vi: "/gio-hang"
    },
    "lien-he": {
      en: "/contact",
      vi: "/lien-he"
    },
    "tai-khoan": {
      en: "/account",
      vi: "/tai-khoan"
    },
    "tra-cuu-don": {
      en: "/order-tracking",
      vi: "/tra-cuu-don"
    },
    "thanh-toan-ket-qua": {
      en: "/payment/result",
      vi: "/thanh-toan/ket-qua"
    }
  },
  skipSettingLocaleOnNavigate: false,
  types: "composition",
  debug: false,
  parallelPlugin: false,
  multiDomainLocales: false,
  i18nModules: []
}

export const normalizedLocales = [
  {
    code: "vi",
    language: "vi-VN",
    name: "Tiếng Việt",
    files: [
      {
        path: "/home/app/locales/vi.json",
        cache: undefined
      }
    ]
  },
  {
    code: "en",
    language: "en-US",
    name: "English",
    files: [
      {
        path: "/home/app/locales/en.json",
        cache: undefined
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false
export const hasPages = true

export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18nInternal"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
/** client **/
if(import.meta.hot) {

function deepEqual(a, b, ignoreKeys = []) {
  // Same reference?
  if (a === b) return true

  // Check if either is null or not an object
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  // Get top-level keys, excluding ignoreKeys
  const keysA = Object.keys(a).filter(k => !ignoreKeys.includes(k))
  const keysB = Object.keys(b).filter(k => !ignoreKeys.includes(k))

  // Must have the same number of keys (after ignoring)
  if (keysA.length !== keysB.length) {
    return false
  }

  // Check each property
  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false
    }

    const valA = a[key]
    const valB = b[key]

    // Compare functions stringified
    if (typeof valA === 'function' && typeof valB === 'function') {
      if (valA.toString() !== valB.toString()) {
        return false
      }
    }
    // If nested, do a normal recursive check (no ignoring at deeper levels)
    else if (typeof valA === 'object' && typeof valB === 'object') {
      if (!deepEqual(valA, valB)) {
        return false
      }
    }
    // Compare primitive values
    else if (valA !== valB) {
      return false
    }
  }

  return true
}



async function loadCfg(config) {
  const nuxt = useNuxtApp()
  const { default: resolver } = await config()
  return typeof resolver === 'function' ? await nuxt.runWithContext(() => resolver()) : resolver
}


  import.meta.hot.accept("../locales/vi.json", async mod => {
    localeLoaders["vi"][0].load = () => Promise.resolve(mod.default)
    await useNuxtApp()._nuxtI18nDev.resetI18nProperties("vi")
  })

  import.meta.hot.accept("../locales/en.json", async mod => {
    localeLoaders["en"][0].load = () => Promise.resolve(mod.default)
    await useNuxtApp()._nuxtI18nDev.resetI18nProperties("en")
  })



}
/** client-end **/