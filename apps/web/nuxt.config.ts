// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Cho phép truy cập dev server qua domain/host ngoài (vd DDNS, LAN)
  vite: {
    server: {
      allowedHosts: ['thanglongcheviet.ddnsfree.com'],
    },
  },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/bootstrap.css',
    '~/assets/css/style.css',
    '~/assets/css/modis-footer.css',
    '~/assets/css/modis-product-list.css',
  ],

  // i18n configuration
  i18n: {
    restructureDir: false,
    defaultLocale: 'vi',
    strategy: 'prefix_except_default',
    customRoutes: 'config',
    pages: {
      'san-pham-list': { en: '/products', vi: '/san-pham-list' },
      'san-pham-slug': { en: '/products/[slug]', vi: '/san-pham/[slug]' },
      'dich-vu': { en: '/services', vi: '/dich-vu' },
      'doi-ngu': { en: '/team', vi: '/doi-ngu' },
      'lang-nghe': { en: '/craft-village', vi: '/lang-nghe' },
      gallery: { en: '/gallery', vi: '/gallery' },
      'tin-tuc': { en: '/blog', vi: '/tin-tuc' },
      'tin-tuc-slug': { en: '/blog/[slug]', vi: '/tin-tuc/[slug]' },
      'lien-he': { en: '/contact', vi: '/lien-he' },
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieMaxAge: 2592000,
      fallbackLocale: 'vi',
    },
  },

  // Image optimization
  image: {
    quality: 85,
    formats: ['webp', 'avif'],
    domains: ['images.unsplash.com'],
    screens: {
      xs: 375,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://thanglongcheviet.vn',
      siteName: 'Thăng Long Chè Việt',
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    },
  },

  // App head defaults
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/png', href: '/tlcv_logo.png' },
        { rel: 'apple-touch-icon', href: '/tlcv_logo.png' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        },
      ],
    },
  },

  // PostCSS (replaces postcss.config.js)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
