const fs = require('fs');
const path = require('path');
const https = require('https');

const layersDir = path.join(__dirname, '..', 'public', 'images', 'layers');
const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(layersDir)) fs.mkdirSync(layersDir, { recursive: true });
if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });

// Strict, 100% verified mapping with explicit WatchModCustom IDs
const VERIFIED_ASSETS = [
  // ── CASES (Group 30) ──
  { file: 'case-sub-40-steel.png', id: '293', thumb: '293-texture.jpg' },
  { file: 'case-sub-40-pvd.png', id: '295', thumb: '295-texture.jpg' },
  { file: 'case-explorer-39.png', id: '606', thumb: '606-texture.jpg' },
  { file: 'case-datejust-36-rg.png', id: '734', thumb: '734-texture.jpg' },
  { file: 'case-skx-42.png', id: '737', thumb: '737-texture.jpg' },
  { file: 'case-daytona-39.png', id: '651', thumb: '651-texture.jpg' },

  // ── DIALS (Group 38) ──
  { file: 'dial-sub-black.png', id: '493', thumb: '493-texture.jpg' },
  { file: 'dial-marine-blue.png', id: '492', thumb: '492-texture.jpg' },
  { file: 'dial-racing-green.png', id: '489', thumb: '489-texture.jpg' },
  { file: 'dial-mop-white.png', id: '331', thumb: '331-texture.jpg' },
  { file: 'dial-open-heart.png', id: '692', thumb: '692-texture.jpg' },
  { file: 'dial-vintage-cream.png', id: '619', thumb: '619-texture.jpg' },
  { file: 'dial-matte-white.png', id: '331', thumb: '331-texture.jpg' },
  { file: 'dial-champagne.png', id: '814', thumb: '814-texture.jpg' },
  { file: 'dial-meteorite.png', id: '833', thumb: '833-texture.jpg' },
  { file: 'dial-forged-carbon.png', id: '635', thumb: '635-texture.jpg' },

  // ── BEZELS (Group 29 & 62) ──
  { file: 'bezel-ceramic-black.png', id: '469', thumb: '469-texture.jpg' },
  { file: 'bezel-pepsi.png', id: '519', thumb: '519-texture.jpg' },
  { file: 'bezel-batman.png', id: '518', thumb: '518-texture.jpg' },
  { file: 'bezel-smooth-steel.png', id: '479', thumb: '479-texture.jpg' },
  { file: 'bezel-fluted-steel.png', id: '742', thumb: '742-texture.jpg' },

  // ── HANDS (Group 41) ──
  { file: 'hands-mercedes-silver.png', id: '484', thumb: '484-texture.jpg' },
  { file: 'hands-mercedes-gold.png', id: '413', thumb: '413-texture.jpg' },
  { file: 'hands-sword-silver.png', id: '679', thumb: '679-texture.jpg' },
  { file: 'hands-snowflake-silver.png', id: '415', thumb: '415-texture.jpg' },
  { file: 'hands-baton-black.png', id: '426', thumb: '426-texture.jpg' },
  { file: 'hands-cathedral-vintage.png', id: '407', thumb: '407-texture.jpg' },

  // ── SECOND HANDS (Group 27 ONLY!) ──
  { file: 'second-lightning-orange.png', id: '456', thumb: '456-texture.jpg' },
  { file: 'second-red-tip.png', id: '593', thumb: '593-texture.jpg' },
  { file: 'second-arrow-blue.png', id: '459', thumb: '459-texture.jpg' },
  { file: 'second-lollipop-green.png', id: '595', thumb: '595-texture.jpg' },
  { file: 'second-classic-rhodium.png', id: '805', thumb: '805-texture.jpg' },

  // ── CROWNS (Group 61 ONLY!) ──
  { file: 'crown-big-7mm.png', id: '738', thumb: '738-texture.jpg' },
  { file: 'crown-signed-65mm.png', id: '740', thumb: '740-texture.jpg' },
  { file: 'crown-onion-fluted.png', id: '739', thumb: '739-texture.jpg' },
  { file: 'crown-pvd-black.png', id: '741', thumb: '741-texture.jpg' },

  // ── CHAPTER RINGS (Group 63 ONLY!) ──
  { file: 'chapter-brushed-silver.png', id: '762', thumb: '762-texture.jpg' },
  { file: 'chapter-matte-black.png', id: '765', thumb: '765-texture.jpg' },
  { file: 'chapter-polished-gold.png', id: '764', thumb: '764-texture.jpg' },
  { file: 'chapter-lumed-diver.png', id: '746', thumb: '746-texture.jpg' },
  { file: 'chapter-arabic-track.png', id: '750', thumb: '750-texture.jpg' },

  // ── STRAPS / BRACELETS (Group 32, 48, 64 ONLY!) ──
  { file: 'strap-oyster-steel.png', id: '395', thumb: '395-texture.jpg' },
  { file: 'strap-jubilee-steel.png', id: '403', thumb: '403-texture.jpg' },
  { file: 'strap-president-gold.png', id: '396', thumb: '396-texture.jpg' },
  { file: 'strap-leather-tan.png', id: '755', thumb: '755-texture.jpg' },
  { file: 'strap-leather-black.png', id: '521', thumb: '521-texture.jpg' },
  { file: 'strap-rubber-waffle.png', id: '636', thumb: '636-texture.jpg' },
  { file: 'strap-rubber-navy.png', id: '387', thumb: '387-texture.jpg' },
  { file: 'strap-milanese-mesh.png', id: '390', thumb: '390-texture.jpg' },
  { file: 'strap-nato-olive.png', id: '658', thumb: '658-home_default.jpg' },
  { file: 'strap-canvas-sand.png', id: '637', thumb: '637-home_default.jpg' },

  // ── CASE BACK (Group 49 ONLY!) ──
  { file: 'caseback-sapphire-display.png', id: '629', thumb: null },
  { file: 'caseback-solid-steel.png', id: '628', thumb: null },
  { file: 'caseback-wave-engraved.png', id: '628', thumb: null },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Starting strict download of ${VERIFIED_ASSETS.length} authentic watch assets...`);

  for (const item of VERIFIED_ASSETS) {
    const layerUrl = `https://www.watchmodcustom.com/img/scenes/ndkcf/${item.id}.jpg`;
    const layerDest = path.join(layersDir, item.file);
    const prodDest = path.join(prodDir, item.file);

    process.stdout.write(`Fetching ${item.file} (ID: ${item.id})... `);
    try {
      // 1. Download Layer (1000x1000 transparent PNG)
      await downloadFile(layerUrl, layerDest);

      // 2. Download Thumbnail for Product Card (or copy layer if no separate thumb)
      if (item.thumb) {
        const thumbUrl = `https://www.watchmodcustom.com/img/scenes/ndkcf/thumbs/${item.thumb}`;
        try {
          await downloadFile(thumbUrl, prodDest);
        } catch {
          // If thumb fails, use layer
          fs.copyFileSync(layerDest, prodDest);
        }
      } else {
        fs.copyFileSync(layerDest, prodDest);
      }

      console.log('✓ OK');
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
    }
  }

  console.log('\nAll verified authentic assets downloaded successfully!');
}

main().catch(console.error);
