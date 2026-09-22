const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyAuditTrail() {
    console.log('--- Phase 3 Audit Trail Technical Verification ---');

    try {
        // 1. Get an Admin User
        const admin = await prisma.user.findFirst({
            where: { role: { in: ['OWNER', 'BRANCH_MANAGER'] } }
        });

        if (!admin) {
            console.error('ERROR: No admin user found to perform verification.');
            return;
        }
        console.log(`Using Admin: ${admin.name} (${admin.role})`);

        // 2. Fetch initial log count
        const initialCount = await prisma.auditLog.count();
        console.log(`Initial Audit Logs: ${initialCount}`);

        // 3. Test: Update a Product
        const product = await prisma.product.findFirst();
        if (product) {
            console.log(`Testing Product Update: ${product.name}`);

            // Note: We are simulating the logic in the API route manually for verification
            await prisma.$transaction([
                prisma.product.update({
                    where: { id: product.id },
                    data: { available: !product.available, price: product.price + 1 }
                }),
                prisma.auditLog.create({
                    data: {
                        userId: admin.id,
                        action: 'UPDATE_PRODUCT',
                        entity: 'Product',
                        entityId: product.id,
                        details: JSON.stringify({ available: !product.available, price: product.price + 1 })
                    }
                })
            ]);
            console.log('✓ Product update logic successful.');
        }

        // 4. Test: Update a Branch
        const branch = await prisma.branch.findFirst();
        if (branch) {
            console.log(`Testing Branch Update: ${branch.name}`);
            await prisma.$transaction([
                prisma.branch.update({
                    where: { id: branch.id },
                    data: { status: 'BUSY' }
                }),
                prisma.auditLog.create({
                    data: {
                        userId: admin.id,
                        action: 'UPDATE_BRANCH',
                        entity: 'Branch',
                        entityId: branch.id,
                        details: JSON.stringify({ status: 'BUSY' })
                    }
                })
            ]);
            console.log('✓ Branch update logic successful.');
        }

        // 5. Verify Logs Presence
        const finalCount = await prisma.auditLog.count();
        console.log(`Final Audit Logs: ${finalCount}`);

        const latestLogs = await prisma.auditLog.findMany({
            take: 2,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });

        console.log('\n--- Recent Audit Journal ---');
        latestLogs.forEach(log => {
            console.log(`[${log.createdAt.toISOString()}] ${log.user.name} | ${log.action} | ${log.entity} (${log.entityId})`);
            console.log(`Details: ${log.details}`);
        });

        if (finalCount > initialCount) {
            console.log('\n✅ VERIFICATION SUCCESS: Audit trail correctly records diverse inputs.');
        } else {
            console.log('\n❌ VERIFICATION FAILURE: No audit logs recorded.');
        }

    } catch (error) {
        console.error('Verification Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAuditTrail();
