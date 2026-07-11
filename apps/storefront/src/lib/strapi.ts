/**
 * Strapi Fetch Utility for Next.js Storefront
 * 
 * Provides a standardized way to fetch content from Strapi CMS
 * with Next.js ISR (Incremental Static Regeneration) cache support.
 */

// Use server-internal URL for SSR/ISR within Docker, fallback to public URL
const STRAPI_API_URL = process.env.STRAPI_API_URL_SERVER || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

interface FetchStrapiParams {
  endpoint: string;
  query?: Record<string, any>;
  options?: RequestInit;
}

/**
 * Helper to fetch data from Strapi API
 */
export async function fetchStrapi<T>({
  endpoint,
  query = {},
  options = {},
}: FetchStrapiParams): Promise<T> {
  // Buid query string if parameters are provided (can use qs library in real app)
  const queryString = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      queryString.append(key, String(value));
    }
  });

  const url = `${STRAPI_API_URL}/api/${endpoint}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // ISR: Cache for 60 seconds
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch API: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching Strapi API [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Fetches all blog articles
 */
export async function getArticles() {
  return fetchStrapi({
    endpoint: 'articles',
    query: { populate: '*' }
  });
}

/**
 * Fetches a single article by slug
 */
export async function getArticleBySlug(slug: string) {
  return fetchStrapi({
    endpoint: 'articles',
    query: { 
      'filters[slug][$eq]': slug,
      populate: '*'
    }
  });
}

/**
 * Fetches landing page by slug
 */
export async function getLandingPage(slug: string) {
  return fetchStrapi({
    endpoint: 'landing-pages',
    query: { 
      'filters[slug][$eq]': slug,
      populate: '*'
    }
  });
}
