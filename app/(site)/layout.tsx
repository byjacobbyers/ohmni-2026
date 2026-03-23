import type { Metadata } from "next"
import Script from "next/script"
import { GoogleTagManager } from "@next/third-parties/google"
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
import OrganizationJsonLd from "@/components/organization-jsonld"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Ohmni",
  description: "Ohmni",
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
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <>
          <Script
            id="consent-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  (function() {
                    var consent = {
                      'ad_storage': 'denied',
                      'analytics_storage': 'denied',
                      'functionality_storage': 'granted',
                      'ad_user_data': 'denied',
                      'ad_personalization': 'denied'
                    };
                    try {
                      var stored = localStorage.getItem('cookieConsent');
                      if (stored) {
                        var parsed = JSON.parse(stored);
                        consent = {
                          'ad_storage': parsed.ad_storage ? 'granted' : 'denied',
                          'analytics_storage': parsed.analytics_storage ? 'granted' : 'denied',
                          'functionality_storage': parsed.functionality_storage !== false ? 'granted' : 'denied',
                          'ad_user_data': parsed.ad_user_data ? 'granted' : 'denied',
                          'ad_personalization': parsed.ad_personalization ? 'granted' : 'denied'
                        };
                      }
                    } catch (e) {}
                    gtag('consent', 'default', consent);
                  })();
                `,
            }}
          />
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        </>
      )}
      <Providers>
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
