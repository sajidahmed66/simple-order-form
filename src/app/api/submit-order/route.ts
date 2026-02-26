import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { trackTikTokPurchase } from '@/lib/tiktok';

// Validation schema matching frontend
const orderSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  mobile: z.string().length(11, 'সঠিক মোবাইল নাম্বার দিন'),
  address: z.string().min(10, 'ঠিকানা কমপক্ষে ১০ অক্ষর হতে হবে'),
  product: z.array(z.string()).min(1, 'অন্তত একটি পণ্য নির্বাচন করুন'),
  size: z.array(z.string()).min(1, 'অন্তত একটি সাইজ নির্বাচন করুন'),
  quantity: z.number().min(1, 'পরিমাণ কমপক্ষে ১ হতে হবে').max(1000, 'পরিমাণ সর্বোচ্চ ১০০০ হতে পারে'),
  tiktokEventId: z.string().optional(), // For TikTok event deduplication
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = orderSchema.parse(body);

    // Get request headers for TikTok tracking
    const headersList = await headers();
    const userIp = headersList.get('x-forwarded-for')?.split(',')[0] ||
                   headersList.get('x-real-ip') ||
                   'unknown';
    const userAgent = headersList.get('user-agent') || undefined;
    const referer = headersList.get('referer') || undefined;

    // Check for existing unresolved order with same mobile number
    const existingOrder = await prisma.order.findFirst({
      where: { mobile: validatedData.mobile },
      orderBy: { createdAt: 'desc' },
    });

    if (existingOrder && existingOrder.status !== 'confirmed' && existingOrder.status !== 'delivered') {
      return NextResponse.json(
        {
          error: 'DUPLICATE_ORDER',
          message: 'এই নম্বরে ইতোমধ্যে একটি অর্ডার প্রক্রিয়াধীন আছে।',
        },
        { status: 409 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        name: validatedData.name,
        mobile: validatedData.mobile,
        address: validatedData.address,
        products: validatedData.product,
        sizes: validatedData.size,
        quantity: validatedData.quantity,
      },
    });

    // Send server-side TikTok event (non-blocking)
    const totalValue = validatedData.quantity * 490;
    trackTikTokPurchase({
      orderId: order.id,
      value: totalValue,
      quantity: validatedData.quantity,
      currency: 'BDT',
      phone: validatedData.mobile,
      eventId: validatedData.tiktokEventId,
      userIp: userIp !== 'unknown' ? userIp : undefined,
      userAgent,
      pageUrl: referer,
    }).catch((err) => {
      // Log but don't fail the order if TikTok tracking fails
      console.error('TikTok server event failed:', err);
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Order submission error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data', details: error.errors },
        { status: 400 }
      );
    }

    // Handle database errors
    return NextResponse.json(
      { error: 'Failed to save order. Please try again.' },
      { status: 500 }
    );
  }
}
