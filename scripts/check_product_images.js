const fs = require('fs');
const path = require('path');

const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'products', 'route.js');
const publicProducts = path.join(__dirname, '..', 'public', 'images', 'products');

const content = fs.readFileSync(routePath, 'utf8');

// crude regex to find image: '...'
const imgRegex = /image:\s*'([^']+)'/g;
let m;
const images = new Set();
while ((m = imgRegex.exec(content)) !== null) {
  images.add(m[1]);
}

console.log('Found image references in route.js:');
for (const img of images) {
  const basename = path.basename(img);
  const candidate = path.join(publicProducts, basename);
  const exists = fs.existsSync(candidate);
  console.log(`${img} -> ${basename} -> ${exists ? 'FOUND' : 'MISSING'}`);
}

// List files in public/products
console.log('\nFiles in public/images/products:');
const files = fs.readdirSync(publicProducts);
for (const f of files) console.log('-', f);
