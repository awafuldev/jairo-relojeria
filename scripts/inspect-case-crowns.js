const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Let's inspect all case images in public/images/layers
const cases = [
  'case-sub-40-steel.png',
  'case-sub-40-pvd.png',
  'case-explorer-39.png',
  'case-datejust-36-rg.png',
  'case-skx-42.png',
  'case-daytona-39.png',
];

async function inspectCases() {
  for (const c of cases) {
    const p = path.join(__dirname, '..', 'public', 'images', 'layers', c);
    if (!fs.existsSync(p)) continue;
    const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Check pixels at 3 o'clock (y between 460 and 540, x between 730 and 800)
    let count3oclock = 0;
    // Check pixels at 4 o'clock (y between 560 and 650, x between 680 and 780)
    let count4oclock = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const alpha = channels === 4 ? data[idx + 3] : 255;
        if (alpha > 20) {
          if (x >= 740 && y >= 460 && y <= 540) count3oclock++;
          if (x >= 700 && y >= 560 && y <= 660) count4oclock++;
        }
      }
    }

    console.log(`${c}: pixels at 3 o'clock crown area: ${count3oclock}, at 4 o'clock area: ${count4oclock}`);
  }
}

inspectCases().catch(console.error);
