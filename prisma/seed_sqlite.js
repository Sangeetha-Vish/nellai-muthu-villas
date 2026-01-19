const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');

const db = new Database('./prisma/dev.db');

function createTables() {
  db.exec(`
  CREATE TABLE IF NOT EXISTS Product (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price REAL NOT NULL,
    weight TEXT NOT NULL,
    tradition TEXT,
    available BOOLEAN NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Branch (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    area TEXT NOT NULL,
    timings TEXT NOT NULL,
    distance TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  `);
}

function clearTables() {
  db.exec('DELETE FROM Product;');
  db.exec('DELETE FROM Branch;');
}

function seed() {
  createTables();
  clearTables();

  // Create Orders tables if missing
  db.exec(`
    CREATE TABLE IF NOT EXISTS Orders (
      id TEXT NOT NULL PRIMARY KEY,
      simpleId TEXT NOT NULL,
      branchId TEXT,
      pickupTime TEXT,
      totalAmount REAL,
      status TEXT,
      customerName TEXT,
      phone TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS OrderItems (
      id TEXT NOT NULL PRIMARY KEY,
      orderId TEXT NOT NULL,
      productId TEXT,
      quantity INTEGER,
      price REAL
    );
  `);

  const products = [
    {
      name: 'Mysore Pak',
      description: 'Traditional ghee-based sweet with a melt-in-mouth texture',
      image: '/images/mysore-pak.jpg',
      price: 450,
      weight: '500g',
      tradition: 'Prepared using the authentic recipe passed down through generations',
      available: 1,
    },
    {
      name: 'Badam Halwa',
      description: 'Rich almond halwa made with pure ghee and premium almonds',
      image: '/images/badam-halwa.jpg',
      price: 650,
      weight: '500g',
      tradition: 'Slow-cooked for hours to achieve the perfect consistency',
      available: 1,
    },
    {
      name: 'Kaju Katli',
      description: 'Diamond-shaped cashew fudge with a delicate sweetness',
      image: '/images/kaju-katli.jpg',
      price: 750,
      weight: '500g',
      tradition: 'Made with the finest cashews and traditional methods',
      available: 1,
    },
    {
      name: 'Gulab Jamun',
      description: 'Soft milk-solid dumplings soaked in rose-flavored syrup',
      image: '/images/gulab-jamun.jpg',
      price: 350,
      weight: '500g',
      tradition: 'Served warm for the best experience',
      available: 1,
    },
    {
      name: 'Jangiri',
      description: 'Crispy, coiled sweet with a vibrant orange color',
      image: '/images/jangiri.jpg',
      price: 400,
      weight: '500g',
      tradition: 'A festival favorite, prepared fresh daily',
      available: 1,
    },
    {
      name: 'Milk Peda',
      description: 'Soft, creamy milk sweet with cardamom flavor',
      image: '/images/milk-peda.jpg',
      price: 380,
      weight: '500g',
      tradition: 'Made from pure milk and traditional recipes',
      available: 1,
    },
  ];

  const insertProduct = db.prepare(`INSERT INTO Product (id, name, description, image, price, weight, tradition, available, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);

  for (const p of products) {
    insertProduct.run(randomUUID(), p.name, p.description, p.image, p.price, p.weight, p.tradition, p.available);
    console.log(`✓ Inserted product: ${p.name}`);
  }

  const branches = [
    {
      name: 'RS Puram',
      location: '123 Avinashi Road, RS Puram',
      area: 'RS Puram',
      timings: '8:00 AM - 9:00 PM',
      distance: '2.5 km',
    },
    {
      name: 'Gandhipuram',
      location: '456 Cross Cut Road, Gandhipuram',
      area: 'Gandhipuram',
      timings: '8:00 AM - 9:30 PM',
      distance: '3.8 km',
    },
    {
      name: 'Saibaba Colony',
      location: '789 Trichy Road, Saibaba Colony',
      area: 'Saibaba Colony',
      timings: '7:30 AM - 9:00 PM',
      distance: '4.2 km',
    },
  ];

  const insertBranch = db.prepare(`INSERT INTO Branch (id, name, location, area, timings, distance, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);

  for (const b of branches) {
    insertBranch.run(randomUUID(), b.name, b.location, b.area, b.timings, b.distance);
    console.log(`✓ Inserted branch: ${b.name}`);
  }

  console.log('\n🎉 Seeding complete.');
}

seed();
