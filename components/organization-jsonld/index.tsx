import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo'
import type { OrganizationJsonLdProps } from '@/types/components/organization-jsonld-type'

// Plain <script>, NOT next/script: JSON-LD must be in the server-rendered HTML
// because most AI crawlers do not execute JavaScript (see AEO-AUDIT.md).
export default function OrganizationJsonLd({ site }: OrganizationJsonLdProps) {
  const org = generateOrganizationJsonLd(site ?? null)
  const web = generateWebSiteJsonLd(site ?? null)
  const schemas = [org, web]

  return (
    <script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  )
}
