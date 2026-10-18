const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function getBBox(filename) {
  const filePath = path.join(__dirname, '..', 'public', 'images', 'layers', filename);
  const { data, info } = await sharp(filePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  let minX = width, maxX = 0, minY = height, maxY = 0;
  let nonZeroCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const alpha = channels === 4 ? data[idx + 3] : 255;
      if (alpha > 10) {
        nonZeroCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`\n=== ${filename} (${width}x${height}) ===`);
  console.log(`  Non-transparent pixels: ${nonZeroCount}`);
  console.log(`  Bounding Box: X=[${minX}, ${maxX}] (width ${maxX - minX + 1}), Y=[${minY}, ${maxY}] (height ${maxY - minY + 1})`);
  console.log(`  Relative Center: X=${((minX + maxX) / 2 / width).toFixed(3)}, Y=${((minY + maxY) / 2 / height).toFixed(3)}`);
}

async function main() {
  await getBBox('case-sub-40-steel.png');
  await getBBox('case-sub-40-pvd.png');
  await getBBox('crown-big-7mm.png');
  await getBBox('crown-pvd-black.png');
  await getBBox('hands-mercedes-silver.png');
  await getBBox('second-red-tip.png');
  await getBBox('dial-sub-black.png');
}

main().catch(console.error);
