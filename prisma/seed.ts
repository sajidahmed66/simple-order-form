import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
        where: { username: 'niloy-fh' }
    });

    if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
    }

    // Create admin with custom credentials
    const hashedPassword = await bcrypt.hash('YUH8ui38*H&^232', 10);

    const admin = await prisma.admin.create({
        data: {
            username: 'niloy-fh',
            password: hashedPassword,
            email: 'admin@fashionhouse.com'
        }
    });

    console.log('✅ Admin user created successfully');
    console.log('Username:', admin.username);
    console.log('⚠️  Keep your password secure!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
