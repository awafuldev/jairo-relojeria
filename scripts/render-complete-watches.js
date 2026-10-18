const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const outputDir = path.join(__dirname, '..', 'public', 'images', 'watches');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const watchDefinitions = [
  {
    id: 'watch-seiko-sub-black',
    slug: 'seiko-mod-submariner-black-date',
    outputFile: 'seiko-submariner-black.png',
    layers: [
      'images/layers/strap-oyster-steel.png',
      'images/layers/case-sub-40-steel.png',
      'images/layers/dial-sub-black.png',
      'images/layers/chapter-brushed-silver.png',
      'images/layers/bezel-ceramic-black.png',
      'images/layers/hands-mercedes-silver.png',
      'images/layers/second-classic-rhodium.png',
      'images/layers/crystal-flat-ar-blue.png',
      'images/layers/crown-signed-65mm.png'
    ]
  },
  {
    id: 'watch-seiko-gmt-batman',
    slug: 'seiko-mod-gmt-batman-nh34',
    outputFile: 'seiko-gmt-batman.png',
    layers: [
      'images/layers/strap-jubilee-steel.png',
      'images/layers/case-sub-40-steel.png',
      'images/layers/dial-sub-black.png',
      'images/layers/chapter-brushed-silver.png',
      'images/layers/bezel-batman.png',
      'images/layers/hands-mercedes-silver.png',
      'images/layers/second-arrow-blue.png',
      'images/layers/crystal-flat-ar-blue.png',
      'images/layers/crown-signed-65mm.png'
    ]
  },
  {
    id: 'watch-seiko-explorer-39',
    slug: 'seiko-mod-explorer-39-black',
    outputFile: 'seiko-explorer-39.png',
    layers: [
      'images/layers/strap-oyster-steel.png',
      'images/layers/case-explorer-39.png',
      'images/layers/dial-sub-black.png',
      'images/layers/bezel-smooth-steel.png',
      'images/layers/hands-mercedes-silver.png',
      'images/layers/second-classic-rhodium.png',
      'images/layers/crystal-flat-ar-blue.png',
      'images/layers/crown-signed-65mm.png'
    ]
  },
  {
    id: 'watch-seiko-datejust-silver',
    slug: 'seiko-mod-datejust-36-fluted',
    outputFile: 'seiko-datejust-36-silver.png',
    layers: [
      'images/layers/strap-jubilee-steel.png',
      'images/layers/case-datejust-36-rg.png',
      'images/layers/dial-champagne.png',
      'images/layers/bezel-fluted-steel.png',
      'images/layers/hands-mercedes-gold.png',
      'images/layers/second-classic-rhodium.png',
      'images/layers/crystal-flat-ar-blue.png',
      'images/layers/crown-signed-65mm.png'
    ]
  },
  {
    id: 'watch-seiko-skx007-custom',
    slug: 'seiko-mod-skx007-custom-diver',
    outputFile: 'seiko-skx007-diver.png',
    layers: [
      'images/layers/strap-rubber-waffle.png',
      'images/layers/case-skx-42.png',
      'images/layers/dial-marine-blue.png',
      'images/layers/chapter-lumed-diver.png',
      'images/layers/bezel-ceramic-black.png',
      'images/layers/hands-sword-silver.png',
      'images/layers/second-red-tip.png',
      'images/layers/crystal-double-domed.png',
      'images/layers/crown-signed-65mm.png'
    ]
  },
  {
    id: 'watch-seiko-tactical-pvd',
    slug: 'seiko-mod-submariner-stealth-pvd',
    outputFile: 'seiko-submariner-pvd.png',
    layers: [
      'images/layers/strap-oyster-steel.png',
      'images/layers/case-sub-40-pvd.png',
      'images/layers/dial-sub-black.png',
      'images/layers/chapter-matte-black.png',
      'images/layers/bezel-ceramic-black.png',
      'images/layers/hands-baton-black.png',
      'images/layers/second-lightning-orange.png',
      'images/layers/crystal-flat-ar-blue.png',
      'images/layers/crown-pvd-black.png'
    ]
  }
];

async function generateAll() {
  for (const def of watchDefinitions) {
    const finalOut = path.join(outputDir, def.outputFile);
    const compositedBuffers = [];

    for (const rel of def.layers) {
      const full = path.join(__dirname, '..', 'public', rel);
      if (fs.existsSync(full)) {
        // Resize each layer buffer to exactly 1000x1000 before compositing
        const buf = await sharp(full)
          .resize(1000, 1000, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer();
        compositedBuffers.push({ input: buf });
      } else {
        console.warn('Missing layer:', full);
      }
    }

    await sharp({
      create: {
        width: 1000,
        height: 1000,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite(compositedBuffers)
    .png()
    .toFile(finalOut);
    console.log('✓ Created complete watch photo:', def.outputFile);

    // Update database record mainImage & gallery
    const webPath = '/images/watches/' + def.outputFile;
    const galleryJson = JSON.stringify([webPath]);
    await prisma.$executeRawUnsafe(
      'UPDATE "WatchProduct" SET "mainImage" = $1, "gallery" = $2 WHERE "id" = $3',
      webPath,
      galleryJson,
      def.id
    );
    console.log('✓ Updated DB record:', def.id, '->', webPath);
  }
  await prisma.$disconnect();
  console.log('✨ ALL 6 SEIKO WATCHES COMPOSITED & DB UPDATED SUCCESSFULLY!');
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
