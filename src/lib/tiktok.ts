/**
 * TikTok Events API - Server-side event tracking
 *
 * This module sends events directly to TikTok's servers for better
 * attribution accuracy (bypasses ad blockers, iOS privacy restrictions)
 */

const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN
const TIKTOK_TEST_EVENT_CODE = process.env.TIKTOK_TEST_EVENT_CODE

// Use Events API v1.3 (latest)
const TIKTOK_EVENTS_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'

interface TikTokEventParams {
  event: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'CompletePayment' | 'Contact' | 'SubmitForm' | 'PlaceAnOrder'
  event_id?: string // For deduplication with browser pixel
  timestamp?: number // Unix timestamp in seconds

  // User data for matching
  user?: {
    phone_number?: string // Will be hashed with SHA256
    email?: string // Will be hashed with SHA256
    external_id?: string
    ip?: string
    user_agent?: string
  }

  // Event properties
  properties?: {
    content_id?: string
    content_type?: string
    content_name?: string
    quantity?: number
    price?: number
    value?: number
    currency?: string
    description?: string
    order_id?: string
  }

  // Page context
  page?: {
    url?: string
    referrer?: string
  }
}

// Simple SHA256 hash function using Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Send an event to TikTok Events API
 */
export async function sendTikTokServerEvent(params: TikTokEventParams): Promise<boolean> {
  if (!TIKTOK_PIXEL_ID || !TIKTOK_ACCESS_TOKEN) {
    console.warn('TikTok Events API: Missing PIXEL_ID or ACCESS_TOKEN')
    console.warn('PIXEL_ID:', TIKTOK_PIXEL_ID ? 'set' : 'missing')
    console.warn('ACCESS_TOKEN:', TIKTOK_ACCESS_TOKEN ? 'set' : 'missing')
    return false
  }

  try {
    // Hash user identifiers
    const userContext: Record<string, string | undefined> = {}

    if (params.user?.phone_number) {
      // Normalize phone number: remove spaces, dashes
      const normalizedPhone = params.user.phone_number.replace(/[\s\-]/g, '')
      userContext.phone_number = await sha256(normalizedPhone)
    }

    if (params.user?.email) {
      userContext.email = await sha256(params.user.email)
    }

    if (params.user?.external_id) {
      userContext.external_id = await sha256(params.user.external_id)
    }

    if (params.user?.ip) {
      userContext.ip = params.user.ip
    }

    if (params.user?.user_agent) {
      userContext.user_agent = params.user.user_agent
    }

    // Build the event data according to TikTok Events API v1.3 spec
    const eventData: Record<string, unknown> = {
      event: params.event,
      event_id: params.event_id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      event_time: params.timestamp || Math.floor(Date.now() / 1000), // Unix timestamp in seconds
      user: userContext,
      properties: {
        ...params.properties,
        currency: params.properties?.currency || 'BDT',
      },
      page: {
        url: params.page?.url || '',
        referrer: params.page?.referrer || '',
      },
    }

    // Build the request payload
    const payload: Record<string, unknown> = {
      event_source: 'web',
      event_source_id: TIKTOK_PIXEL_ID,
      data: [eventData],
    }

    // Add test event code if configured
    if (TIKTOK_TEST_EVENT_CODE) {
      payload.test_event_code = TIKTOK_TEST_EVENT_CODE
    }

    console.log('TikTok Events API: Sending event...', {
      event: params.event,
      event_id: eventData.event_id,
      test_mode: !!TIKTOK_TEST_EVENT_CODE,
    })

    const response = await fetch(TIKTOK_EVENTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    console.log('TikTok Events API Response:', JSON.stringify(result, null, 2))

    if (result.code === 0) {
      console.log(`TikTok Events API: ${params.event} event sent successfully`)
      return true
    } else {
      console.error('TikTok Events API error:', {
        code: result.code,
        message: result.message,
        data: result.data,
      })
      return false
    }
  } catch (error) {
    console.error('TikTok Events API request failed:', error)
    return false
  }
}

/**
 * Track a completed order/payment - call this after order is saved to DB
 */
export async function trackTikTokPurchase(params: {
  orderId: string
  value: number
  quantity: number
  currency?: string
  phone?: string
  eventId?: string
  userIp?: string
  userAgent?: string
  pageUrl?: string
}): Promise<boolean> {
  console.log('TikTok: Tracking purchase...', {
    orderId: params.orderId,
    value: params.value,
    quantity: params.quantity,
  })

  return sendTikTokServerEvent({
    event: 'CompletePayment',
    event_id: params.eventId,
    user: {
      phone_number: params.phone,
      ip: params.userIp,
      user_agent: params.userAgent,
    },
    properties: {
      order_id: params.orderId,
      value: params.value,
      quantity: params.quantity,
      currency: params.currency || 'BDT',
      content_type: 'product',
      content_name: 'Drop Shoulder T-shirt',
      content_id: 'drop-shoulder-tshirt',
    },
    page: {
      url: params.pageUrl,
    },
  })
}
