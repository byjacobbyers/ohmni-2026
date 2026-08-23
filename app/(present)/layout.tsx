import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/sanity/lib/live'
import { sans, mono, serif } from '../(site)/fonts'
import { cn } from '@/lib/utils'
import { brand } from '@/lib/brand'
import '../(site)/globals.css'

/**
 * Presentation chrome: the site's fonts and tokens, none of its furniture.
 * No header, footer, announcement bar or smooth scroll, because a deck should
 * offer no way out of the deck.
 */
export const metadata: Metadata = {
  title: brand.name,
  robots: { index: false, follow: false },
}

export default async function PresentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled } = await draftMode()
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
    <body className="antialiased" suppressHydrationWarning>
    <div
      className={cn(
        sans.variable,
        mono.variable,
        serif.variable,
        'min-h-screen antialiased bg-background text-foreground font-sans'
      )}
    >
      {/* The texture filter lives in the site layout, which this route group
          deliberately does not inherit. Sections using it need it here too. */}
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
      {children}
      {/* Without this, sanityFetch tags responses and nothing ever revalidates
          them, so a published deck edit never reaches the screen. */}
      <SanityLive />
      {/* Lets Studio's Presentation tool show drafts and click-to-edit on a deck. */}
      {isEnabled && <VisualEditing zIndex={999999} />}
    </div>
    </body>
    </html>
  )
}
