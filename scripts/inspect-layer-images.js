const fs = require('fs');
const path = require('path');

const layers = [
  'case-sub-40-steel.png',
  'dial-sub-black.png',
  'hands-mercedes-silver.png',
  'second-red-tip.png',
  'crown-big-7mm.png',
  'crown-pvd-black.png',
  'crystal-flat-ar-blue.png',
  'crystal-double-domed.png',
  'crystal-top-hat-box.png',
];

for (const l of layers) {
  const p = path.join(__dirname, '..', 'public', 'images', 'layers', l);
  if (fs.existsSync(p)) {
    const buf = fs.readFileSync(p);
    // check magic bytes
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
    console.log(`${l}: size=${buf.length} bytes, format=${isPng ? 'PNG' : isJpg ? 'JPG' : 'OTHER'}`);
  } else {
    console.log(`${l}: NOT FOUND`);
  }
}
