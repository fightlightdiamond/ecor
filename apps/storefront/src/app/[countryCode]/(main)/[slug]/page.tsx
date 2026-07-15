import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getLandingPageBySlug } from "@lib/strapi"
import LandingPageTemplate, {
  buildLandingMetadata,
} from "@modules/landing/templates/landing-page"

export const revalidate = 60

type PageProps = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params
  const meta = await buildLandingMetadata(slug)

  if (!meta) {
    return { title: "Trang không tồn tại" }
  }

  return meta
}

export default async function DynamicLandingPage(props: PageProps) {
  const { countryCode, slug } = await props.params
  const page = await getLandingPageBySlug(slug).catch(() => null)

  if (!page) {
    notFound()
  }

  return <LandingPageTemplate page={page} countryCode={countryCode} />
}
