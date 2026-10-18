const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function inspectCaseCrownArea() {
  const casePath = path.join(__dirname, '..', 'public', 'images', 'layers', 'case-sub-40-steel.png');
  const { data, info } = await sharp(casePath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's find the exact bounding box of the crown on the right side of the case (X > 730)
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 730; x < width; x++) {
      const idx = (y * width + x) * channels;
      const alpha = data[idx + 3];
      if (alpha > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Crown area on case-sub-40-steel: X=[${minX}, ${maxX}] (w=${maxX - minX + 1}), Y=[${minY}, ${maxY}] (h=${maxY - minY + 1})`);
}

inspectCaseCrownArea().catch(console.error);
