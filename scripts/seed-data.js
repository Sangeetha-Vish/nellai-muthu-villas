const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new Database(dbPath);

function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

console.log('🌱 Starting database seed...\n');

try {
    const now = new Date().toISOString();

    // Clear existing data (Order matters for Foreign Keys!)
    console.log('Clearing existing data...');
    db.prepare('DELETE FROM OrderItem').run();
    db.prepare('DELETE FROM "Order"').run();
    db.prepare('DELETE FROM User').run();
    db.prepare('DELETE FROM Product').run();
    db.prepare('DELETE FROM Branch').run();
    console.log('✓ Cleared existing data\n');

    // Insert Products
    console.log('Adding products...');
    const insertProduct = db.prepare(`
        INSERT INTO Product (id, name, description, image, price, weight, tradition, available, specialCategory, tags, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const products = [
        // NMV SPECIAL
        [generateId(), 'Tirunelveli Halwa', 'Our signature wheat halwa, cooked slowly in Thamirabarani river water.', '/images/halwa.jpg', 360, '500g', 'The soul of Nella Muthu Vilas.', 1, 'NMV_SPECIAL', 'Pure Ghee,Traditional Recipe,Signature', now, now],
        [generateId(), 'Muscoth Halwa', 'A coconut milk based delicacy. Rich, chewy, and distinctively flavored.', '/images/muscoth.jpg', 420, '500g', 'Coastal district specialty.', 1, 'NMV_SPECIAL', 'Coconut Milk,Rich', now, now],
        [generateId(), 'Ghee Mysore Pak', 'Melt-in-your-mouth texture with the rich aroma of pure ghee.', '/images/mysore-pak.jpg', 380, '500g', 'Royal delicacy.', 1, 'NMV_SPECIAL', 'Pure Ghee,Soft', now, now],

        // FESTIVAL FAVOURITE
        [generateId(), 'Laddu', 'Classic besan laddu with cashews and raisins. Essential for every celebration.', '/images/laddu.jpg', 280, '500g', 'Golden festival drops.', 1, 'FESTIVAL_FAVOURITE', 'Seasonal Sweet,Kids Favourite', now, now],
        [generateId(), 'Jangiri', 'Ornate, flower-shaped sweet made from urad dal batter and soaked in sugar syrup.', '/images/jangiri.jpg', 260, '500g', 'Art on a plate.', 1, 'FESTIVAL_FAVOURITE', 'Traditional Recipe,Juicy', now, now],

        // CUSTOMER FAVOURITE
        [generateId(), 'Mixture', 'Spicy, crunchy south Indian mixture with karasev, boondi, and curry leaves.', '/images/mixture.jpg', 220, '400g', 'Perfect evening snack.', 1, 'CUSTOMER_FAVOURITE', 'Spicy,Crunchy,Savoury', now, now],
        [generateId(), 'Palkova', 'Milk sweet made by simmering milk until it thickens. Simple and divine.', '/images/palkova.jpg', 400, '250g', 'Pure milk goodness.', 1, 'CUSTOMER_FAVOURITE', 'Milk Sweet,Kids Favourite', now, now],

        // ALL / OTHERS
        [generateId(), 'Karasev', 'Thick, spicy gram flour noodles. Great with coffee.', '/images/karasev.jpg', 200, '250g', 'Crunchy bite.', 1, null, 'Spicy,Savoury', now, now],
        [generateId(), 'Badusha', 'Flaky pastry soaked in sugar syrup. Mild sweetness.', '/images/badusha.jpg', 300, '500g', 'Mild & Soft.', 1, null, 'Light & Mild', now, now]
    ];

    for (const product of products) {
        insertProduct.run(...product);
        console.log(`  ✓ Added: ${product[1]}`);
    }

    // Insert Branches
    console.log('\nAdding branches...');
    const insertBranch = db.prepare(`
        INSERT INTO Branch (id, name, location, area, timings, distance, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const branches = [
        [generateId(), 'RS Puram', '123 Avinashi Road, RS Puram', 'RS Puram', '8:00 AM - 9:00 PM', '2.5 km', now, now],
        [generateId(), 'Gandhipuram', '456 Cross Cut Road, Gandhipuram', 'Gandhipuram', '8:00 AM - 9:30 PM', '3.8 km', now, now],
        [generateId(), 'Saibaba Colony', '789 Trichy Road, Saibaba Colony', 'Saibaba Colony', '7:30 AM - 9:00 PM', '4.2 km', now, now]
    ];

    for (const branch of branches) {
        insertBranch.run(...branch);
        console.log(`  ✓ Added: ${branch[1]}`);
    }

    // Insert Users
    console.log('\nAdding users...');
    const insertUser = db.prepare(`
        INSERT INTO User (id, email, password, name, phone, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const hashedPassword = bcrypt.hashSync('password123', 10);
    const users = [
        [generateId(), 'customer@example.com', hashedPassword, 'Sangeetha Customer', '9876543210', 'CUSTOMER', now, now],
        [generateId(), 'staff@nellamuthu.com', hashedPassword, 'Staff Member', '1234567890', 'STAFF', now, now]
    ];

    for (const user of users) {
        insertUser.run(...user);
        console.log(`  ✓ Added user: ${user[1]}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');

} catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.code) console.error('Error Code:', error.code);
} finally {
    db.close();
}
