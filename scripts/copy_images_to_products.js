const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'public', 'images');
const destDir = path.join(repoRoot, 'public', 'images', 'products');

const files = [
  'badam-halwa.jpg',
  'gulab-jamun.jpg',
  'jangiri.jpg',
  'kaju-katli.jpg',
  'milk-peda.jpg',
  'mysore-pak.jpg',
];

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

for (const f of files) {
  const src = path.join(srcDir, f);
  const dest = path.join(destDir, f);
  try {
    if (!fs.existsSync(src)) {
      console.warn(`Source missing: ${src}`);
      continue;
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied ${f} -> ${path.relative(repoRoot, dest)}`);
  } catch (err) {
    console.error(`Failed to copy ${f}:`, err.message);
  }
}
