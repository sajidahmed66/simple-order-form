/**
 * TikTok Events API - Server-side event tracking
 *
 * This module sends events directly to TikTok's servers for better
 * attribution accuracy (bypasses ad blockers, iOS privacy restrictions)
 */

const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN
const TIKTOK_EVENTS_API_URL = 'https://business-api.tiktok.com/open_api/v1.2/pixel/track/'

interface TikTokEventParams {
  event: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'CompletePayment' | 'Contact' | 'SubmitForm' | 'PlaceAnOrder'
  event_id?: string // For deduplication with browser pixel
  timestamp?: string // ISO 8601 format

  // User data for matching
  user?: {
    phone_number?: string // Hashed with SHA256
    email?: string // Hashed with SHA256
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
    return false
  }

  try {
    // Hash user identifiers
    const hashedUser: Record<string, string | undefined> = {}

    if (params.user?.phone_number) {
      // Normalize phone number: remove spaces, dashes, and country code prefix
      const normalizedPhone = params.user.phone_number.replace(/[\s\-]/g, '')
      hashedUser.phone_number = await sha256(normalizedPhone)
    }

    if (params.user?.email) {
      hashedUser.email = await sha256(params.user.email)
    }

    if (params.user?.external_id) {
      hashedUser.external_id = await sha256(params.user.external_id)
    }

    // Build the event payload
    const eventData = {
      pixel_code: TIKTOK_PIXEL_ID,
      event: params.event,
      event_id: params.event_id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      timestamp: params.timestamp || new Date().toISOString(),
      context: {
        user: {
          ...hashedUser,
          ip: params.user?.ip,
          user_agent: params.user?.user_agent,
        },
        page: params.page,
        ad: {
          callback: params.event_id, // Used for deduplication
        },
      },
      properties: params.properties,
    }

    const response = await fetch(TIKTOK_EVENTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        data: [eventData],
      }),
    })

    const result = await response.json()

    if (result.code === 0) {
      console.log(`TikTok Events API: ${params.event} event sent successfully`)
      return true
    } else {
      console.error('TikTok Events API error:', result)
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
    },
    page: {
      url: params.pageUrl,
    },
  })
}
