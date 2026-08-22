import SiteShell, { siteMetadata } from '@/components/site-shell'
import '../(site)/globals.css'

export const revalidate = 60

export const generateMetadata = siteMetadata

/** Spanish root: same shell, Spanish chrome, and `lang="es"` on the document. */
export default function SpanishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SiteShell lang="es">{children}</SiteShell>
      </body>
    </html>
  )
}
