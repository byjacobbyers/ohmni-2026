// Google Tag Manager utility functions (dataLayer-first)
// PostHog rides along: consent + custom events bridge into the second lane here,
// so every existing trackEvent call site feeds both GA4/GTM and PostHog.

import posthog from 'posthog-js'

type ConsentModeValue = 'granted' | 'denied'

type ConsentUpdate = {
  ad_storage: ConsentModeValue
  analytics_storage: ConsentModeValue
  functionality_storage: ConsentModeValue
  ad_user_data: ConsentModeValue
  ad_personalization: ConsentModeValue
}

type GTMEvent = {
  event: string
  [key: string]: unknown
}

const ensureDataLayer = () => {
  if (typeof window === 'undefined') return null
  const win = window as Window & { dataLayer?: Array<unknown> }
  win.dataLayer = win.dataLayer || []
  return win.dataLayer
}

const pushToDataLayer = (payload: Record<string, unknown>) => {
  const dataLayer = ensureDataLayer()
  if (!dataLayer) return
  dataLayer.push(payload)
}

export const updateConsentMode = (consent: ConsentUpdate, mode: 'default' | 'update' = 'update') => {
  if (typeof window === 'undefined') return

  const dataLayer = ensureDataLayer()
  if (!dataLayer) return

  if (mode === 'default') {
    const win = window as Window & {
      gtag?: (cmd: string, action: string, params: Record<string, string>) => void
    }
    if (win.gtag) {
      win.gtag('consent', mode, consent)
    } else {
      dataLayer.push(['consent', mode, consent])
    }
    return
  }

  const win = window as Window & {
    gtag?: (cmd: string, action: string, params: Record<string, string>) => void
  }
  if (win.gtag) {
    win.gtag('consent', 'update', consent)
  } else {
    dataLayer.push(['consent', 'update', consent])
  }

  const consentEvent = {
    event: 'consent_update',
    ad_storage: consent.ad_storage,
    analytics_storage: consent.analytics_storage,
    functionality_storage: consent.functionality_storage,
    ad_user_data: consent.ad_user_data,
    ad_personalization: consent.ad_personalization,
  }
  setTimeout(() => dataLayer.push(consentEvent), 0)

  // PostHog lane: init leaves capturing opted out; analytics consent flips it.
  if (posthog.__loaded) {
    if (consent.analytics_storage === 'granted') {
      if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing()
    } else if (!posthog.has_opted_out_capturing()) {
      posthog.opt_out_capturing()
    }
  }
}

export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  pushToDataLayer({ event: eventName, ...parameters })
  // capture() is a no-op while the visitor is opted out, so consent holds here too
  if (posthog.__loaded) posthog.capture(eventName, parameters)
}

/**
 * Merge the anonymous browser person into a known one. Call the moment an email
 * is known (form submit). Everything that anonymous id did, before and after,
 * folds into the identified person, and server-side events keyed by the same
 * email land there too. No-op while the visitor is opted out, so consent holds.
 */
export const identifyVisitor = (email: string, properties: Record<string, unknown> = {}) => {
  const id = email.trim().toLowerCase()
  if (!id || !posthog.__loaded || posthog.has_opted_out_capturing()) return
  posthog.identify(id, { email: id, ...properties })
}

export const trackGeolocation = (geolocation: { country: string; region: string; city: string }) => {
  const payload: GTMEvent = {
    event: 'geolocation_detected',
    country: geolocation.country,
    region: geolocation.region,
    city: geolocation.city,
  }

  pushToDataLayer(payload)
}
