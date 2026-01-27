import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'f8a9c7b2e1d4a6f3c9e2b5d8a1f4c7e0b3d6a9c2e5f8b1d4a7c0e3f6b9c2e5'
);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('admin-token')?.value;

    // Allow login page
    if (request.nextUrl.pathname === '/admin/login') {
        if (token) {
            try {
                await jwtVerify(token, secret);
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } catch {
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    // Protect admin routes
    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: '/admin/:path*',
};
