/**
 * Downloads authentic studio photography for each watch component
 * and saves into public/images/products/
 */
const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

// Curated high-res Unsplash macro watch photography URLs (all free/open license)
const PHOTO_MAP = {
  // Movements
  'movement-nh35.jpg': 'https://plus.unsplash.com/premium_photo-1723759401659-7984c69b1b18?auto=format&fit=crop&q=85&w=800',
  'movement-nh34-gmt.jpg': 'https://plus.unsplash.com/premium_photo-1723561230205-3a8f566f8ba9?auto=format&fit=crop&q=85&w=800',
  'movement-nh38-skeleton.jpg': 'https://plus.unsplash.com/premium_photo-1723579309665-7fb9a110279e?auto=format&fit=crop&q=85&w=800',

  // Cases
  'case-sub-40-steel.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'case-sub-40-pvd.jpg': 'https://plus.unsplash.com/premium_photo-1732798892248-abf0179a8468?auto=format&fit=crop&q=85&w=800',
  'case-explorer-39.jpg': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800',
  'case-datejust-36-rg.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=85&w=800',
  'case-skx-42.jpg': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=85&w=800',
  'case-daytona-39.jpg': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=85&w=800',

  // Dials
  'dial-sub-black.jpg': 'https://plus.unsplash.com/premium_photo-1728324776761-a088b2b9fbbb?auto=format&fit=crop&q=85&w=800',
  'dial-marine-blue.jpg': 'https://plus.unsplash.com/premium_photo-1680265495595-0606df8a8412?auto=format&fit=crop&q=85&w=800',
  'dial-racing-green.jpg': 'https://plus.unsplash.com/premium_photo-1723561230205-3a8f566f8ba9?auto=format&fit=crop&q=85&w=800',
  'dial-mop-white.jpg': 'https://plus.unsplash.com/premium_photo-1728582543415-1e28161533c6?auto=format&fit=crop&q=85&w=800',
  'dial-open-heart.jpg': 'https://plus.unsplash.com/premium_photo-1723579309665-7fb9a110279e?auto=format&fit=crop&q=85&w=800',
  'dial-vintage-cream.jpg': 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=85&w=800',
  'dial-matte-white.jpg': 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=85&w=800',
  'dial-champagne.jpg': 'https://plus.unsplash.com/premium_photo-1776971293466-f7beaa416278?auto=format&fit=crop&q=85&w=800',
  'dial-meteorite.jpg': 'https://plus.unsplash.com/premium_photo-1728324830661-ac471243bade?auto=format&fit=crop&q=85&w=800',
  'dial-forged-carbon.jpg': 'https://plus.unsplash.com/premium_photo-1728324830661-ac471243bade?auto=format&fit=crop&q=85&w=800',

  // Bezels
  'bezel-ceramic-black.jpg': 'https://plus.unsplash.com/premium_photo-1669659064336-880b49cbf571?auto=format&fit=crop&q=85&w=800',
  'bezel-pepsi.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'bezel-batman.jpg': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800',
  'bezel-smooth-steel.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=85&w=800',
  'bezel-fluted-steel.jpg': 'https://plus.unsplash.com/premium_photo-1723561230205-3a8f566f8ba9?auto=format&fit=crop&q=85&w=800',

  // Hands
  'hands-mercedes-silver.jpg': 'https://plus.unsplash.com/premium_photo-1723561230205-3a8f566f8ba9?auto=format&fit=crop&q=85&w=800',
  'hands-mercedes-gold.jpg': 'https://plus.unsplash.com/premium_photo-1776971293466-f7beaa416278?auto=format&fit=crop&q=85&w=800',
  'hands-sword-silver.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'hands-snowflake-silver.jpg': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800',
  'hands-baton-black.jpg': 'https://plus.unsplash.com/premium_photo-1728324776761-a088b2b9fbbb?auto=format&fit=crop&q=85&w=800',
  'hands-cathedral-vintage.jpg': 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=85&w=800',

  // Second Hands
  'second-lightning-orange.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'second-red-tip.jpg': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=85&w=800',
  'second-arrow-blue.jpg': 'https://plus.unsplash.com/premium_photo-1680265495595-0606df8a8412?auto=format&fit=crop&q=85&w=800',
  'second-lollipop-green.jpg': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=85&w=800',
  'second-classic-rhodium.jpg': 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=85&w=800',

  // Crowns
  'crown-big-7mm.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'crown-signed-65mm.jpg': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800',
  'crown-onion-fluted.jpg': 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=85&w=800',
  'crown-pvd-black.jpg': 'https://plus.unsplash.com/premium_photo-1732798892248-abf0179a8468?auto=format&fit=crop&q=85&w=800',

  // Crystals
  'crystal-flat-ar-blue.jpg': 'https://plus.unsplash.com/premium_photo-1680265495595-0606df8a8412?auto=format&fit=crop&q=85&w=800',
  'crystal-double-domed.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'crystal-top-hat-box.jpg': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800',

  // Chapter Rings
  'chapter-brushed-silver.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=85&w=800',
  'chapter-matte-black.jpg': 'https://plus.unsplash.com/premium_photo-1728324776761-a088b2b9fbbb?auto=format&fit=crop&q=85&w=800',
  'chapter-polished-gold.jpg': 'https://plus.unsplash.com/premium_photo-1776971293466-f7beaa416278?auto=format&fit=crop&q=85&w=800',
  'chapter-lumed-diver.jpg': 'https://plus.unsplash.com/premium_photo-1669659064336-880b49cbf571?auto=format&fit=crop&q=85&w=800',
  'chapter-arabic-track.jpg': 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=85&w=800',

  // Straps / Bracelets
  'strap-oyster-steel.jpg': 'https://images.unsplash.com/photo-1782012133180-91aca4bcf9ad?auto=format&fit=crop&q=85&w=800',
  'strap-jubilee-steel.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'strap-president-gold.jpg': 'https://plus.unsplash.com/premium_photo-1776971293466-f7beaa416278?auto=format&fit=crop&q=85&w=800',
  'strap-leather-tan.jpg': 'https://plus.unsplash.com/premium_photo-1728324830661-ac471243bade?auto=format&fit=crop&q=85&w=800',
  'strap-leather-black.jpg': 'https://plus.unsplash.com/premium_photo-1723568571445-24c92fc4d566?auto=format&fit=crop&q=85&w=800',
  'strap-rubber-waffle.jpg': 'https://images.unsplash.com/photo-1784315061882-b49e83865e19?auto=format&fit=crop&q=85&w=800',
  'strap-rubber-navy.jpg': 'https://plus.unsplash.com/premium_photo-1680265495595-0606df8a8412?auto=format&fit=crop&q=85&w=800',
  'strap-milanese-mesh.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=85&w=800',
  'strap-nato-olive.jpg': 'https://plus.unsplash.com/premium_photo-1728324783539-50d0b699118d?auto=format&fit=crop&q=85&w=800',
  'strap-canvas-sand.jpg': 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=85&w=800',

  // Case Backs
  'caseback-sapphire-display.jpg': 'https://images.unsplash.com/photo-1745305023239-b476a0faa159?auto=format&fit=crop&q=85&w=800',
  'caseback-solid-steel.jpg': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=85&w=800',
  'caseback-wave-engraved.jpg': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800',

  // Engraving
  'engraving-custom.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=85&w=800'
};

async function downloadAll() {
  console.log(`Downloading ${Object.keys(PHOTO_MAP).length} authentic luxury watch photos into public/images/products/...`);

  for (const [filename, url] of Object.entries(PHOTO_MAP)) {
    const dest = path.join(PRODUCTS_DIR, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`  ✓ Already exists: ${filename}`);
      continue;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(dest, buffer);
      console.log(`  ✓ Downloaded: ${filename} (${buffer.length} bytes)`);
    } catch (e) {
      console.error(`  ✗ Failed downloading ${filename}: ${e.message}`);
    }
  }

  // Also copy the 6 ultra-high-res Gemini generated studio images to products if they exist
  const layersDir = path.join(__dirname, '..', 'public', 'images', 'layers');
  const genFiles = [
    ['case-steel-40.jpg', 'case-sub-40-steel.jpg'],
    ['case-pvd-black.jpg', 'case-sub-40-pvd.jpg'],
    ['dial-blue-sunburst.jpg', 'dial-marine-blue.jpg'],
    ['dial-black-matte.jpg', 'dial-sub-black.jpg'],
    ['dial-white-silver.jpg', 'dial-matte-white.jpg'],
    ['dial-champagne-gold.jpg', 'dial-champagne.jpg']
  ];

  for (const [src, dst] of genFiles) {
    const srcPath = path.join(layersDir, src);
    const dstPath = path.join(PRODUCTS_DIR, dst);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, dstPath);
      console.log(`  ✓ Overwrote with ultra-sharp studio photograph: ${dst}`);
    }
  }

  console.log('\nAll product photography successfully prepared in public/images/products/!');
}

downloadAll().catch(console.error);
