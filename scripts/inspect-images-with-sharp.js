const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function analyze() {
  const layers = [
    'case-sub-40-steel.png',
    'case-sub-40-pvd.png',
    'crown-big-7mm.png',
    'crown-pvd-black.png',
    'crystal-flat-ar-blue.png',
    'hands-mercedes-silver.png',
    'dial-sub-black.png',
  ];

  for (const file of layers) {
    const filePath = path.join(__dirname, '..', 'public', 'images', 'layers', file);
    if (!fs.existsSync(filePath)) {
      console.log(`${file}: NOT FOUND`);
      continue;
    }
    const meta = await sharp(filePath).metadata();
    const stats = await sharp(filePath).stats();
    console.log(`\n=== ${file} ===`);
    console.log(`  Dimensions: ${meta.width}x${meta.height}, format: ${meta.format}, channels: ${meta.channels}, hasAlpha: ${meta.hasAlpha}`);
    console.log(`  Alpha channel stats: min=${stats.channels[3]?.min}, max=${stats.channels[3]?.max}, mean=${stats.channels[3]?.mean}`);
  }
}

analyze().catch(console.error);
