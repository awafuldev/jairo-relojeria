const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function inspectColumns() {
  const casePath = path.join(__dirname, '..', 'public', 'images', 'layers', 'case-sub-40-steel.png');
  const { data, info } = await sharp(casePath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's print the max X for each Y between 450 and 550
  for (let y = 460; y <= 540; y += 5) {
    let maxX = 0;
    for (let x = 700; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (data[idx + 3] > 30) {
        if (x > maxX) maxX = x;
      }
    }
    console.log(`Y=${y}: maxX=${maxX}`);
  }
}

inspectColumns().catch(console.error);
