import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { resolveBrand } from '@/lib/brand'
import { cn } from '@/lib/utils'
import { sans, mono, serif } from '@/app/(site)/fonts'
import Template from '@/app/(site)/template'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import { AnnouncementQuery } from '@/sanity/queries/documents/announcement-query'
import { PreviewBar } from '@/components/preview-bar'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnnouncementBar from '@/components/announcement'
import SmoothScrollProvider from '@/components/providers/smooth-scroll-provider'
import { Providers } from '@/components/providers'
import OrganizationJsonLd from '@/components/organization-jsonld'
import type { SiteType } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'
import type { AnnouncementType } from '@/types/documents/announcement-type'

/** Shared by the English and Spanish root layouts. */
export async function siteMetadata(): Promise<Metadata> {
  try {
    const { data: site } = await sanityFetch({ query: SiteQuery, stega: false })
    const resolved = resolveBrand(site as SiteType | null)
    return { title: resolved.name, description: resolved.description }
  } catch {
    const resolved = resolveBrand()
    return { title: resolved.name, description: resolved.description }
  }
}

/**
 * Everything inside <body> for the marketing site: fonts, texture filter,
 * consent bootstrap, chrome. The locale only changes which navigation,
 * announcement and UI strings are fetched; the structure is identical.
 */
export default async function SiteShell({
  lang,
  children,
}: Readonly<{ lang: Locale; children: React.ReactNode }>) {
  const { isEnabled } = await draftMode()
  const now = new Date()
  const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const [{ data: siteData }, announcementRes] = await Promise.all([
    sanityFetch({ query: SiteQuery }),
    sanityFetch({
      query: AnnouncementQuery,
      params: { today: todayLocal, lang },
    }).catch(() => ({ data: null })),
  ])
  const site = siteData as React.ComponentProps<typeof OrganizationJsonLd>['site']
  const announcement = (announcementRes.data ?? null) as AnnouncementType | null

  return (
    <div
      className={cn(
        sans.variable,
        mono.variable,
        serif.variable,
        'min-h-screen antialiased bg-background text-foreground font-sans',
        isEnabled && 'body-preview-mode'
      )}
    >
      <svg aria-hidden className="absolute w-0 h-0 overflow-hidden">
        <defs>
          <filter id="advanced-texture">
            <feTurbulence result="noise" numOctaves="3" baseFrequency="0.7" type="fractalNoise" />
            <feSpecularLighting result="specular" lightingColor="white" specularExponent="20" specularConstant="0.8" surfaceScale="2" in="noise">
              <fePointLight z="100" y="50" x="50" />
            </feSpecularLighting>
            <feComposite result="litNoise" operator="in" in2="SourceGraphic" in="specular" />
            <feBlend mode="overlay" in2="litNoise" in="SourceGraphic" />
          </filter>
        </defs>
      </svg>
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
      <Providers lang={lang}>
        {site && <OrganizationJsonLd site={site} />}
        {isEnabled && <PreviewBar />}
        <SmoothScrollProvider>
          <AnnouncementBar announcement={announcement} lang={lang} />
          <Header lang={lang} />
          <Template>
            {children}
            {isEnabled && (
              <>
                <SanityLive />
                <VisualEditing zIndex={999999} />
              </>
            )}
          </Template>
          <Footer lang={lang} />
        </SmoothScrollProvider>
      </Providers>
    </div>
  )
}
