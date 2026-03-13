// Google Tag Manager utility functions

export const initializeGTM = (gtmId: string) => {
  if (typeof window === 'undefined') return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date().toISOString())
}

export const setDefaultConsent = () => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
  })
}

export const trackGeolocation = (geolocation: {
  country: string
  region: string
  city: string
}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID'

  window.gtag('config', gaMeasurementId, {
    user_country: geolocation.country,
    user_region: geolocation.region,
    user_city: geolocation.city,
  })

  window.gtag('event', 'geolocation_detected', {
    country: geolocation.country,
    region: geolocation.region,
    city: geolocation.city,
  })
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (
      command: string,
      action: string,
      parameters?: Record<string, unknown>
    ) => void
  }
}
