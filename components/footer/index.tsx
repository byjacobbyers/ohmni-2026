import Link from 'next/link'
import Route from '@/components/route'
import { BaseRouteType } from '@/types/objects/route-type'

type FooterProps = {
  navigation?: { items?: BaseRouteType[] } | null
}

export default function Footer({ navigation }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-4 border-foreground bg-background px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <small className="text-sm">
          © {year} Wiggelrhum. All rights reserved.
        </small>
        <nav className="flex items-center gap-6">
          {navigation?.items?.map((item, i) => (
            <Route key={i} data={item} className="text-sm hover:opacity-80">
              {item.title || 'Link'}
            </Route>
          ))}
        </nav>
      </div>
    </footer>
  )
}
