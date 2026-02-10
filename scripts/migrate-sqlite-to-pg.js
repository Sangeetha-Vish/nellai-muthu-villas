const { PrismaClient } = require('@prisma/client');
const Database = require('better-sqlite3');
const path = require('path');

async function migrate() {
    const sqlite = new Database(path.join(__dirname, '../dev.db'));
    const prisma = new PrismaClient();

    try {
        console.log('Starting migration...');

        // 1. Migrate Products
        const products = sqlite.prepare('SELECT * FROM Product').all();
        console.log(`Found ${products.length} products`);
        for (const p of products) {
            await prisma.product.create({
                data: {
                    ...p,
                    available: Boolean(p.available),
                }
            });
        }

        // 2. Migrate Branches
        const branches = sqlite.prepare('SELECT * FROM Branch').all();
        console.log(`Found ${branches.length} branches`);
        for (const b of branches) {
            await prisma.branch.create({
                data: {
                    ...b,
                    isActive: Boolean(b.isActive),
                }
            });
        }

        // 3. Migrate Users
        const users = sqlite.prepare('SELECT * FROM User').all();
        console.log(`Found ${users.length} users`);
        for (const u of users) {
            await prisma.user.create({
                data: u
            });
        }

        // 4. Migrate Orders
        const orders = sqlite.prepare('SELECT * FROM "Order"').all();
        console.log(`Found ${orders.length} orders`);
        for (const o of orders) {
            // Convert SQLite timestamps to JS Dates
            await prisma.order.create({
                data: {
                    ...o,
                    otpVerified: Boolean(o.otpVerified),
                    pickupTime: new Date(o.pickupTime),
                    createdAt: new Date(o.createdAt),
                    updatedAt: new Date(o.updatedAt),
                }
            });
        }

        // 5. Migrate OrderItems
        const orderItems = sqlite.prepare('SELECT * FROM OrderItem').all();
        console.log(`Found ${orderItems.length} order items`);
        for (const oi of orderItems) {
            await prisma.orderItem.create({
                data: oi
            });
        }

        // 6. Migrate AuditLogs
        const auditLogs = sqlite.prepare('SELECT * FROM AuditLog').all();
        console.log(`Found ${auditLogs.length} audit logs`);
        for (const al of auditLogs) {
            await prisma.auditLog.create({
                data: {
                    ...al,
                    createdAt: new Date(al.createdAt),
                }
            });
        }

        // 7. Migrate Feedback
        const feedbacks = sqlite.prepare('SELECT * FROM Feedback').all();
        console.log(`Found ${feedbacks.length} feedbacks`);
        for (const f of feedbacks) {
            await prisma.feedback.create({
                data: {
                    ...f,
                    createdAt: new Date(f.createdAt),
                }
            });
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        sqlite.close();
        await prisma.$disconnect();
    }
}

migrate();
