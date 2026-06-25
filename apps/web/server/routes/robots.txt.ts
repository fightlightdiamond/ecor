export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const baseUrl = String(config.public.siteUrl || 'https://thanglongcheviet.vn').replace(/\/$/, '')

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return body
})
