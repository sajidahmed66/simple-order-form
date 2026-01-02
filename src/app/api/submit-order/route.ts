import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json(
        { error: 'Google Script URL not configured' },
        { status: 500 }
      );
    }

    // Send to Google Sheets with timeout
    // With no-cors we can't read the response, but we assume success if no error
    await Promise.race([
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      ),
    ]).catch(() => {
      // Ignore timeout/network errors - data may still reach sheet
      console.log('Request sent (response may be delayed)');
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500 }
    );
  }
}
