const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'dev.db');
const db = new Database(dbPath);

try {
    const products = db.prepare("PRAGMA table_info(Product)").all();
    console.log('--- Product Columns ---');
    products.forEach(c => console.log(`${c.name} (${c.type})`));

    const branches = db.prepare("PRAGMA table_info(Branch)").all();
    console.log('\n--- Branch Columns ---');
    branches.forEach(c => console.log(`${c.name} (${c.type})`));
} catch (error) {
    console.error('Error:', error);
} finally {
    db.close();
}
