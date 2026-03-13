import type { Metadata } from "next"
import { sans, mono, serif } from "./fonts"
import { cn } from "@/lib/utils"
import "./globals.css"
import Template from "./template"
import { sanityFetch, SanityLive } from "@/sanity/lib/live"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import { headerQuery, footerQuery } from "@/sanity/queries/components/page-nav-query"
import { PreviewBar } from "@/components/preview-bar"
import { VisualEditing } from "next-sanity/visual-editing"
import { draftMode } from "next/headers"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SmoothScrollProvider from "@/components/smooth-scroll-provider"
import { Providers } from "@/components/providers"
import { GTMInit } from "@/components/gtm-init"
import OrganizationJsonLd from "@/components/organization-jsonld"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Wiggelrhum",
  description: "Wiggelrhum",
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled } = await draftMode()
  const [{ data: site }, { data: headerNav }, { data: footerNav }] = await Promise.all([
    sanityFetch({ query: SiteQuery }),
    sanityFetch({ query: headerQuery }),
    sanityFetch({ query: footerQuery }),
  ])

  return (
    <div className={cn(sans.variable, mono.variable, serif.variable, "min-h-screen antialiased bg-background text-foreground font-sans", isEnabled && "body-preview-mode")}>
      <Providers>
        <GTMInit />
        {site && <OrganizationJsonLd site={site} />}
        {isEnabled && <PreviewBar />}
        <SmoothScrollProvider>
          <Header navigation={headerNav} />
          <Template>
            {children}
            <SanityLive />
            {isEnabled && <VisualEditing zIndex={999999} />}
          </Template>
          <Footer navigation={footerNav} />
        </SmoothScrollProvider>
      </Providers>
    </div>
  )
}
