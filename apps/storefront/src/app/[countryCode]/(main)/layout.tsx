import { Metadata } from "next"

import { Suspense } from "react"



import CartChrome from "@modules/layout/components/cart-chrome"

import Footer from "@modules/layout/templates/footer"

import Nav from "@modules/layout/templates/nav"

import { getBaseURL } from "@lib/util/env"



export const metadata: Metadata = {

  metadataBase: new URL(getBaseURL()),

}



function FooterFallback() {

  return <div className="w-full h-40 bg-ui-bg-subtle animate-pulse border-t border-ui-border-base" aria-hidden />

}



export default function PageLayout(props: { children: React.ReactNode }) {

  return (

    <>

      <Nav />

      <Suspense fallback={null}>

        <CartChrome />

      </Suspense>

      {props.children}

      <Suspense fallback={<FooterFallback />}>

        <Footer />

      </Suspense>

    </>

  )

}


