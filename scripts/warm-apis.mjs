/**
 * Warm Medusa + Strapi after startup so the storefront's first page load
 * does not pay the Strapi develop-mode cold-compile penalty (~2s).
 */
const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"
const STRAPI_URL =
  process.env.STRAPI_API_URL_SERVER ||
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "http://127.0.0.1:1337"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const targets = [
  { name: "medusa-health", url: `${MEDUSA_URL}/health` },
  ...(PUBLISHABLE_KEY
    ? [
        {
          name: "medusa-regions",
          url: `${MEDUSA_URL}/store/regions`,
          headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
        },
      ]
    : []),
  {
    name: "strapi-landing-pages",
    url: `${STRAPI_URL}/api/landing-pages?filters[slug][$eq]=home&status=published`,
  },
]

async function ping({ name, url, headers = {} }) {
  const start = performance.now()
  try {
    const res = await fetch(url, { headers })
    const ms = Math.round(performance.now() - start)
    console.log(`${name}: ${res.status} (${ms}ms)`)
  } catch (error) {
    const ms = Math.round(performance.now() - start)
    console.log(`${name}: failed (${ms}ms) — ${error.message}`)
  }
}

async function main() {
  console.log("Warming API endpoints...")
  for (const target of targets) {
    await ping(target)
  }
}

main()
