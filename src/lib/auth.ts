import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'f8a9c7b2e1d4a6f3c9e2b5d8a1f4c7e0b3d6a9c2e5f8b1d4a7c0e3f6b9c2e5'
);

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload: {
    adminId: string;
    username: string;
}) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

    return token;
}

export async function verifyToken(token: string) {
    try {
        const verified = await jwtVerify(token, secret);
        return verified.payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) return null;

    return verifyToken(token);
}

export async function authenticate(username: string, password: string) {
    const admin = await prisma.admin.findUnique({
        where: { username },
    });

    if (!admin) return null;

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) return null;

    return { id: admin.id, username: admin.username };
}
