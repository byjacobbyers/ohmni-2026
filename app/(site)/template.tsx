import { cn } from '@/lib/utils'

// CSS animation, not motion/react: the motion version shipped opacity:0 in
// the server HTML, hiding the whole page until hydration and gating LCP on
// the JS bundle. Next still remounts templates per navigation, so the fade
// replays on client-side route changes exactly as before. Reduced motion is
// handled by the media query on .page-fade-in in globals.css.
export default function Template({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('page-fade-in', className)}>{children}</div>
}
