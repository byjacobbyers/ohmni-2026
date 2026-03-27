import Route from '@/components/route'
import { CookieSettingsTrigger } from '@/components/cookie-consent-banner/cookie-settings-trigger'
import { BaseRouteType } from '@/types/objects/route-type'

type FooterProps = {
  navigation?: { items?: BaseRouteType[] } | null
}

export default function Footer({ navigation }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-4 border-primary bg-background px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <small className="text-sm">
            © {year} Ohmni. All rights reserved.
          </small>
          
        </div>
        <nav className="flex items-center gap-6">
          {navigation?.items?.map((item, i) => (
            <Route key={i} data={item} className="text-sm hover:opacity-80">
              {item.title || 'Link'}
            </Route>
          ))}
        </nav>
        <CookieSettingsTrigger />
      </div>
    </footer>
  )
}
