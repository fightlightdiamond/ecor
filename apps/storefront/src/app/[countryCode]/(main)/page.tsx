import { Metadata } from "next"

import { Suspense } from "react"



import FeaturedProductsSection from "@modules/home/components/featured-products-section"

import LandingHero, {

  DEFAULT_LANDING_HERO_CONTENT,

  buildLandingHeroProps,

} from "@modules/landing/components/hero"

import { normalizeLandingBlocks } from "@modules/landing/lib/normalize-landing-blocks"
import LandingPageTemplate, {

  buildLandingMetadata,

} from "@modules/landing/templates/landing-page"

import { getLandingPageBySlug } from "@lib/strapi"



export async function generateMetadata(): Promise<Metadata> {

  const fromCms = await buildLandingMetadata("home")



  if (fromCms) {

    return fromCms

  }



  return {

    title: "Thăng Long Chè Việt",

    description:

      "Khám phá trà Việt Nam chất lượng cao — tinh hoa văn hoá trà truyền thống.",

  }

}



export const revalidate = 60



function FeaturedFallback() {

  return <div className="w-full h-48 bg-ui-bg-subtle animate-pulse" aria-hidden />

}



function FallbackHome({ countryCode }: { countryCode: string }) {

  return (

    <>

      <LandingHero

        {...buildLandingHeroProps(countryCode, DEFAULT_LANDING_HERO_CONTENT)}

      />

      <Suspense fallback={<FeaturedFallback />}>

        <FeaturedProductsSection countryCode={countryCode} />

      </Suspense>

    </>

  )

}



async function HomeContent({ countryCode }: { countryCode: string }) {

  const cmsHome = await getLandingPageBySlug("home").catch(() => null)



  if (cmsHome?.blocks?.length) {
    const normalized = normalizeLandingBlocks(cmsHome.blocks)
    if (normalized.length) {
      return (
        <LandingPageTemplate
          page={{ ...cmsHome, blocks: normalized }}
          countryCode={countryCode}
        />
      )
    }
  }



  return <FallbackHome countryCode={countryCode} />

}



export default async function Home(props: {

  params: Promise<{ countryCode: string }>

}) {

  const { countryCode } = await props.params



  return (

    <Suspense fallback={<FallbackHome countryCode={countryCode} />}>

      <HomeContent countryCode={countryCode} />

    </Suspense>

  )

}


