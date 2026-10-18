const fs = require('fs');
const path = require('path');

// Read PNG and parse chunks or inspect dimensions
function analyzePng(filePath) {
  const buf = fs.readFileSync(filePath);
  // PNG signature
  if (buf.readUInt32BE(0) !== 0x89504E47) {
    console.log(filePath, 'NOT A VALID PNG');
    return null;
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25]; // 6 is RGBA
  console.log(`${path.basename(filePath)}: ${width}x${height}, bitDepth=${bitDepth}, colorType=${colorType}, size=${buf.length}`);
  return { width, height, colorType };
}

const files = [
  'case-sub-40-steel.png',
  'case-sub-40-pvd.png',
  'crown-big-7mm.png',
  'crown-pvd-black.png',
  'crystal-flat-ar-blue.png'
];

for (const f of files) {
  const p = path.join(__dirname, '..', 'public', 'images', 'layers', f);
  if (fs.existsSync(p)) {
    analyzePng(p);
  }
}
