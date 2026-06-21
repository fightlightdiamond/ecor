import productsData from '~/content/products.json'

// Ảnh sản phẩm nằm trong ~/assets/images -> resolve qua glob (Vite build URL).
const imgModules = import.meta.glob('~/assets/images/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const resolveImg = (name: string) =>
  Object.entries(imgModules).find(([k]) => k.endsWith(`/${name}`))?.[1] ?? ''

export interface Product {
  id: string
  slug: string
  price: number
  image: string
  gallery: string[]
  title: string
  shortDesc: string
  description: string
  features: string[]
}

export function useProducts() {
  const { locale } = useI18n()

  const L = (f: Record<string, string> | undefined) =>
    f?.[locale.value] ?? f?.vi ?? ''
  const LA = (f: Record<string, string[]> | undefined) =>
    f?.[locale.value] ?? f?.vi ?? []

  const products = computed<Product[]>(() =>
    productsData.items.map(p => ({
      id: p.id,
      slug: p.slug,
      price: p.price,
      image: resolveImg(p.image),
      gallery: (p.gallery?.length ? p.gallery : [p.image]).map(resolveImg),
      title: L(p.title),
      shortDesc: L(p.shortDesc),
      description: L(p.description),
      features: LA(p.features),
    })),
  )

  const getBySlug = (slug: string) =>
    products.value.find(p => p.slug === slug)

  const related = (slug: string, count = 3) =>
    products.value.filter(p => p.slug !== slug).slice(0, count)

  return { products, getBySlug, related }
}
