import SiteShell, { siteMetadata } from '@/components/site-shell'
import './globals.css'

export const revalidate = 60

export const generateMetadata = siteMetadata

/**
 * English root. Spanish has its own root layout under (es) so <html lang>
 * is right in the HTML itself, not patched in after hydration. Switching
 * language is therefore a full navigation, which is what you want anyway.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SiteShell lang="en">{children}</SiteShell>
      </body>
    </html>
  )
}
