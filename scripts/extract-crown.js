const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function extractCrown() {
  const casePath = path.join(__dirname, '..', 'public', 'images', 'layers', 'case-sub-40-steel.png');
  // Crop around X=[735, 795], Y=[460, 540]
  await sharp(casePath)
    .extract({ left: 735, top: 460, width: 60, height: 80 })
    .toFile(path.join(__dirname, 'test-extracted-crown.png'));

  console.log('Extracted crown to test-extracted-crown.png');
}

extractCrown().catch(console.error);
