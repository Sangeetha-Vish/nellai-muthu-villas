const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@nmv.com' }
        });

        if (admin) {
            console.log('Admin user found:', admin.email, admin.role);
        } else {
            console.log('Admin user NOT found');
        }
    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
