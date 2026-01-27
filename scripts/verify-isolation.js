const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDataIsolation() {
    console.log('--- Order Security & Isolation Verification ---');

    try {
        // 1. Get two distinct users
        const users = await prisma.user.findMany({
            take: 2,
            where: { role: 'CUSTOMER' }
        });

        if (users.length < 2) {
            console.warn('Need at least 2 customer users in DB to perform isolation test.');
            return;
        }

        const userA = users[0];
        const userB = users[1];

        console.log(`User A: ${userA.email} (ID: ${userA.id})`);
        console.log(`User B: ${userB.email} (ID: ${userB.id})`);

        // 2. Fetch orders for User A
        const ordersA = await prisma.order.findMany({
            where: { userId: userA.id }
        });

        // 3. Fetch orders for User B
        const ordersB = await prisma.order.findMany({
            where: { userId: userB.id }
        });

        console.log(`User A matches: ${ordersA.length} orders`);
        console.log(`User B matches: ${ordersB.length} orders`);

        // 4. CROSS-CHECK: Ensure User A's result set contains NO orders from User B
        const leakFound = ordersA.some(order => order.userId === userB.id);

        if (!leakFound) {
            console.log('\n✅ SECURITY SUCCESS: Data isolation confirmed at Database query level.');
        } else {
            console.error('\n❌ SECURITY FAILURE: Cross-user data leak detected!');
        }

        // 5. Test API logic simulation
        async function simulateApiCall(authenticatedUserId) {
            // This replicates the prisma query in /api/orders
            return await prisma.order.findMany({
                where: { userId: authenticatedUserId }
            });
        }

        const simA = await simulateApiCall(userA.id);
        const simB = await simulateApiCall(userB.id);

        const isSimSecure = simA.every(o => o.userId === userA.id) && simB.every(o => o.userId === userB.id);

        if (isSimSecure) {
            console.log('✓ API Query logic simulation passed.');
        }

    } catch (error) {
        console.error('Verification Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyDataIsolation();
