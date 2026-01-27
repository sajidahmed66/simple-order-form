import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema matching frontend
const orderSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  mobile: z.string().length(11, 'সঠিক মোবাইল নাম্বার দিন'),
  address: z.string().min(10, 'ঠিকানা কমপক্ষে ১০ অক্ষর হতে হবে'),
  product: z.array(z.string()).min(1, 'অন্তত একটি পণ্য নির্বাচন করুন'),
  size: z.array(z.string()).min(1, 'অন্তত একটি সাইজ নির্বাচন করুন'),
  quantity: z.number().min(1, 'পরিমাণ কমপক্ষে ১ হতে হবে').max(1000, 'পরিমাণ সর্বোচ্চ ১০০০ হতে পারে'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = orderSchema.parse(body);

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
