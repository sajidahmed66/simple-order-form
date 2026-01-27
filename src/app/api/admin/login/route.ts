import { NextResponse } from 'next/server';
import { authenticate, createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const admin = await authenticate(username, password);

        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await createToken({
            adminId: admin.id,
            username: admin.username,
        });

        const cookieStore = await cookies();
        cookieStore.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({ success: true, username: admin.username });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
