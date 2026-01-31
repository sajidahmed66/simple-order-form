'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

// Extend window type for TikTok pixel
declare global {
  interface Window {
    ttq?: {
      page: () => void
      track: (event: string, params?: Record<string, unknown>, config?: { event_id?: string }) => void
      identify: (params: Record<string, unknown>) => void
      load: (pixelId: string) => void
    }
  }
}

export function TikTokPixel() {
  const pathname = usePathname()

  // Don't load pixel on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  // Don't render if pixel ID is not configured
  if (!TIKTOK_PIXEL_ID) {
    return null
  }

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
          ttq.load('${TIKTOK_PIXEL_ID}');
          ttq.page();
        }(window, document, 'ttq');
      `}
    </Script>
  )
}

// Generate a unique event ID for deduplication between browser and server events
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Helper function to track events from anywhere in the app
export function trackTikTokEvent(
  event: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'CompletePayment' | 'Contact' | 'SubmitForm' | 'PlaceAnOrder',
  params?: {
    content_id?: string
    content_type?: string
    content_name?: string
    quantity?: number
    price?: number
    value?: number
    currency?: string
    description?: string
  },
  eventId?: string
) {
  if (typeof window !== 'undefined' && window.ttq) {
    const config = eventId ? { event_id: eventId } : undefined
    window.ttq.track(event, params, config)
  }
}

// Identify user for better attribution
export function identifyTikTokUser(params: {
  email?: string
  phone_number?: string
  external_id?: string
}) {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.identify(params)
  }
}
