'use client'

/**
 * TikTok Pixel Helper Functions
 *
 * The base pixel code is loaded in layout.tsx (in <head> section)
 * This file exports helper functions for tracking events
 */

const TIKTOK_TEST_EVENT_CODE = process.env.NEXT_PUBLIC_TIKTOK_TEST_EVENT_CODE

// Extend window type for TikTok pixel
declare global {
  interface Window {
    ttq?: {
      page: () => void
      track: (event: string, params?: Record<string, unknown>, config?: { event_id?: string; test_event_code?: string }) => void
      identify: (params: Record<string, unknown>) => void
      load: (pixelId: string) => void
    }
  }
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
    // Build config with optional event_id and test_event_code
    const config: { event_id?: string; test_event_code?: string } = {}
    if (eventId) {
      config.event_id = eventId
    }
    if (TIKTOK_TEST_EVENT_CODE) {
      config.test_event_code = TIKTOK_TEST_EVENT_CODE
    }

    window.ttq.track(event, params, Object.keys(config).length > 0 ? config : undefined)
    console.log('TikTok Pixel: Event tracked', { event, params, config })
  } else {
    console.warn('TikTok Pixel: ttq not available', { event })
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
    console.log('TikTok Pixel: User identified', params)
  }
}
