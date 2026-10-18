const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '..', 'prisma', 'seed.ts');
let content = fs.readFileSync(seedPath, 'utf8');

// Replace lines 80-84
const oldBlock = `    const cat = c[data.categorySlug]
    const layerPath = \`/images/layers/\${data.layerFile}\`
    const prodFile = data.layerFile.replace('.svg', '.jpg')
    const prodPath = \`/images/products/\${prodFile}\``;

const newBlock = `    const cat = c[data.categorySlug]
    const baseName = data.layerFile.replace(/\\.(svg|png|jpg)$/, '')
    const layerPath = \`/images/layers/\${baseName}.png\`
    const prodPath = \`/images/products/\${baseName}.png\``;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
}

// Replace all .svg with .png
content = content.replace(/\.svg/g, '.png');

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Successfully updated prisma/seed.ts with .png layers!');
