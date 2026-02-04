const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedData() {
  console.log('🌱 Starting database seed...\n');

  try {
    console.log('Clearing existing data...');
    // Clear in correct order of dependencies
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Cleared existing data\n');

    console.log('Adding products...');
    const products = [
      {
        name: 'Mysore Pak',
        description: 'Traditional ghee-based sweet with a melt-in-mouth texture',
        image: '/images/mysore-pak.jpg',
        price: 450,
        weight: '500g',
        tradition:
          'Prepared using the authentic recipe passed down through generations',
        available: true,
      },
      {
        name: 'Badam Halwa',
        description: 'Rich almond halwa made with pure ghee and premium almonds',
        image: '/images/badam-halwa.jpg',
        price: 650,
        weight: '500g',
        tradition: 'Slow-cooked for hours to achieve the perfect consistency',
        available: true,
      },
      {
        name: 'Kaju Katli',
        description: 'Diamond-shaped cashew fudge with a delicate sweetness',
        image: '/images/kaju-katli.jpg',
        price: 750,
        weight: '500g',
        tradition: 'Made with the finest cashews and traditional methods',
        available: true,
      },
      {
        name: 'Gulab Jamun',
        description: 'Soft milk-solid dumplings soaked in rose-flavored syrup',
        image: '/images/gulab-jamun.jpg',
        price: 350,
        weight: '500g',
        tradition: 'Served warm for the best experience',
        available: true,
      },
      {
        name: 'Jangiri',
        description: 'Crispy, coiled sweet with a vibrant orange color',
        image: '/images/jangiri.jpg',
        price: 400,
        weight: '500g',
        tradition: 'A festival favorite, prepared fresh daily',
        available: true,
      },
      {
        name: 'Milk Peda',
        description: 'Soft, creamy milk sweet with cardamom flavor',
        image: '/images/milk-peda.jpg',
        price: 380,
        weight: '500g',
        tradition: 'Made from pure milk and traditional recipes',
        available: true,
      },
    ];

    for (const product of products) {
      await prisma.product.create({ data: product });
      console.log(`  ✓ Added: ${product.name}`);
    }
    console.log(`\n✅ Successfully added ${products.length} products\n`);

    console.log('Adding branches...');
    const branches = [
      {
        name: 'RS Puram',
        location: '123 Avinashi Road, RS Puram',
        area: 'RS Puram',
        timings: '8:00 AM - 9:00 PM',
        distance: '2.5 km',
        latitude: 11.0084,
        longitude: 76.9427,
      },
      {
        name: 'Gandhipuram',
        location: '456 Cross Cut Road, Gandhipuram',
        area: 'Gandhipuram',
        timings: '8:00 AM - 9:30 PM',
        distance: '3.8 km',
        latitude: 11.0168,
        longitude: 76.9558,
      },
      {
        name: 'Saibaba Colony',
        location: '789 Trichy Road, Saibaba Colony',
        area: 'Saibaba Colony',
        timings: '7:30 AM - 9:00 PM',
        distance: '4.2 km',
        latitude: 11.0304,
        longitude: 76.9472,
      },
    ];

    for (const branch of branches) {
      await prisma.branch.create({ data: branch });
      console.log(`  ✓ Added: ${branch.name}`);
    }
    console.log(`\n✅ Successfully added ${branches.length} branches\n`);

    console.log('Adding Admin users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@nmv.com',
        password: hashedAdminPassword,
        name: 'Admin Owner',
        role: 'OWNER',
      }
    });

    const hashedManagerPassword = await bcrypt.hash('manager123', 10);
    // Find RS Puram branch to assign manager
    const rsPuram = await prisma.branch.findFirst({ where: { name: 'RS Puram' } });

    await prisma.user.create({
      data: {
        email: 'manager@nmv.com',
        password: hashedManagerPassword,
        name: 'Branch Manager',
        role: 'BRANCH_MANAGER',
        branchId: rsPuram?.id
      }
    });
    console.log('  ✓ Added: admin@nmv.com (OWNER)');
    console.log('  ✓ Added: manager@nmv.com (BRANCH_MANAGER)');

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
