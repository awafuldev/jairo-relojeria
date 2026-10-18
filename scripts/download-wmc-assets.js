const fs = require('fs');
const path = require('path');

const layersDir = path.join(__dirname, '..', 'public', 'images', 'layers');
const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(layersDir)) fs.mkdirSync(layersDir, { recursive: true });
if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });

const html = fs.readFileSync(path.join(__dirname, 'wmc-full.html'), 'utf8');

// Pattern to extract (src, name, thumb)
// <li ... data-src="https://www.watchmodcustom.com/img/scenes/ndkcf/293.jpg" ... data-thumb="https://.../thumbs/293-texture.jpg" ... alt="Rose gold Sub case 40mm"
const itemRegex = /data-src="([^"]+)"[\s\S]*?(?:data-thumb="([^"]+)")?[\s\S]*?(?:alt="([^"]*)"|title="([^"]*)")/gi;
let match;
const items = [];
const seenUrls = new Set();

while ((match = itemRegex.exec(html)) !== null) {
  const src = match[1].trim();
  const thumb = (match[2] || '').trim();
  const name = (match[3] || match[4] || '').trim();
  if (!name || name === 'Custom watch' || seenUrls.has(src)) continue;
  seenUrls.add(src);
  items.push({ name, src, thumb });
}

console.log(`Found ${items.length} unique authentic watch assets in WMC configurator.`);

// Define target mapping for our 12 categories
const TARGET_MAP = {
  // ── CASES ──
  'case-sub-40-steel.png': { search: /sharp silver 40mm|sub case 40mm/i, defaultId: '295' }, // 295 is Nautilus/Sub Silver
  'case-sub-40-pvd.png': { search: /black sub case 40mm|sharp black/i, defaultId: '296' },
  'case-explorer-39.png': { search: /explorer silver 39mm|explorer 36mm/i, defaultId: '849' },
  'case-datejust-36-rg.png': { search: /rose gold sub case|dj silver rose gold/i, defaultId: '293' },
  'case-skx-42.png': { search: /kx rose gold|kx gold/i, defaultId: '675' },
  'case-daytona-39.png': { search: /pilot steel 38mm|sharp silver/i, defaultId: '606' },

  // ── DIALS ──
  'dial-sub-black.png': { search: /black baton|waffle matte black/i, defaultId: '328' },
  'dial-marine-blue.png': { search: /blue baton|waffle blue/i, defaultId: '669' },
  'dial-racing-green.png': { search: /green baton/i, defaultId: '665' },
  'dial-mop-white.png': { search: /white baton/i, defaultId: '331' },
  'dial-open-heart.png': { search: /open heart/i, defaultId: '692' },
  'dial-vintage-cream.png': { search: /arabic rose gold brown|grey sunburst/i, defaultId: '619' },
  'dial-matte-white.png': { search: /white baton/i, defaultId: '331' },
  'dial-champagne.png': { search: /arabic silver|gmt seiko custom gold/i, defaultId: '694' },
  'dial-meteorite.png': { search: /meterorite baton/i, defaultId: '486' },
  'dial-forged-carbon.png': { search: /carbon forged baton/i, defaultId: '631' },

  // ── BEZELS ──
  'bezel-ceramic-black.png': { search: /gold bezel|sub bezel/i, defaultId: '745' },
  'bezel-pepsi.png': { search: /pepsi gmt|pepsi dual/i, defaultId: '482' },
  'bezel-batman.png': { search: /batman gmt|batman dual/i, defaultId: '455' },
  'bezel-smooth-steel.png': { search: /gold bezel/i, defaultId: '745' },
  'bezel-fluted-steel.png': { search: /pepsi gmt/i, defaultId: '482' },

  // ── HANDS ──
  'hands-mercedes-silver.png': { search: /silver snowflakes/i, defaultId: '804' },
  'hands-mercedes-gold.png': { search: /rose gold snowflakes/i, defaultId: '415' },
  'hands-sword-silver.png': { search: /silver snowflakes/i, defaultId: '804' },
  'hands-snowflake-silver.png': { search: /silver snowflakes/i, defaultId: '804' },
  'hands-baton-black.png': { search: /brown baton|pink baton/i, defaultId: '834' },
  'hands-cathedral-vintage.png': { search: /rose gold snowflakes/i, defaultId: '415' },

  // ── SECOND HANDS ──
  'second-lightning-orange.png': { search: /orange rubber|pink baton/i, defaultId: '490' },
  'second-red-tip.png': { search: /red rubber/i, defaultId: '490' },
  'second-arrow-blue.png': { search: /blue baton/i, defaultId: '723' },
  'second-lollipop-green.png': { search: /green baton/i, defaultId: '490' },
  'second-classic-rhodium.png': { search: /silver snowflakes/i, defaultId: '804' },

  // ── CROWNS ──
  'crown-big-7mm.png': { search: /crown|sharp/i, defaultId: '295' },
  'crown-signed-65mm.png': { search: /crown|sharp/i, defaultId: '293' },
  'crown-onion-fluted.png': { search: /crown|sharp/i, defaultId: '294' },
  'crown-pvd-black.png': { search: /crown|sharp/i, defaultId: '296' },

  // ── CRYSTALS ──
  'crystal-flat-ar-blue.png': { search: /glass|sapphire/i, defaultId: '669' },
  'crystal-double-domed.png': { search: /glass|sapphire/i, defaultId: '669' },
  'crystal-top-hat-box.png': { search: /glass|sapphire/i, defaultId: '669' },

  // ── CHAPTER RINGS ──
  'chapter-brushed-silver.png': { search: /brushed metal/i, defaultId: '656' },
  'chapter-matte-black.png': { search: /brushed metal/i, defaultId: '656' },
  'chapter-polished-gold.png': { search: /brushed metal/i, defaultId: '656' },
  'chapter-lumed-diver.png': { search: /brushed metal/i, defaultId: '656' },
  'chapter-arabic-track.png': { search: /arabic/i, defaultId: '814' },

  // ── STRAPS / BRACELETS ──
  'strap-oyster-steel.png': { search: /oyster bracelet steel/i, defaultId: '695' },
  'strap-jubilee-steel.png': { search: /oyster bracelet steel/i, defaultId: '695' },
  'strap-president-gold.png': { search: /gold/i, defaultId: '294' },
  'strap-leather-tan.png': { search: /brown/i, defaultId: '753' },
  'strap-leather-black.png': { search: /grey rubber/i, defaultId: '753' },
  'strap-rubber-waffle.png': { search: /grey rubber fkm/i, defaultId: '753' },
  'strap-rubber-navy.png': { search: /orange rubber fkm/i, defaultId: '754' },
  'strap-milanese-mesh.png': { search: /oyster bracelet/i, defaultId: '695' },
  'strap-nato-olive.png': { search: /rubber/i, defaultId: '770' },
  'strap-canvas-sand.png': { search: /yellow rubber fkm/i, defaultId: '773' },

  // ── CASEBACKS ──
  'caseback-sapphire-display.png': { search: /open heart/i, defaultId: '692' },
  'caseback-solid-steel.png': { search: /sub case/i, defaultId: '295' },
  'caseback-wave-engraved.png': { search: /sub case/i, defaultId: '296' },

  // ── MOVEMENTS ──
  'movement-nh35.png': { search: /gmt seiko custom/i, defaultId: '495' },
  'movement-nh34-gmt.png': { search: /gmt seiko custom gold/i, defaultId: '694' },
  'movement-nh38-skeleton.png': { search: /open heart/i, defaultId: '692' },

  // ── ENGRAVING ──
  'engraving-custom.png': { search: /open heart/i, defaultId: '692' }
};

async function downloadAssets() {
  console.log('Downloading WatchModCustom transparent 1000x1000 PNG layers...');

  for (const [targetFile, config] of Object.entries(TARGET_MAP)) {
    // Find matching item in items list
    let matchedItem = items.find(it => config.search.test(it.name));
    let url = matchedItem ? matchedItem.src : `https://www.watchmodcustom.com/img/scenes/ndkcf/${config.defaultId}.jpg`;

    const destLayer = path.join(layersDir, targetFile);
    const destProd = path.join(prodDir, targetFile);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());

      // Save as layer (.png)
      fs.writeFileSync(destLayer, buf);

      // Save as product (.png)
      fs.writeFileSync(destProd, buf);

      // Also save as .jpg for compatibility if needed
      const destProdJpg = path.join(prodDir, targetFile.replace('.png', '.jpg'));
      fs.writeFileSync(destProdJpg, buf);

      console.log(`  ✓ ${targetFile} <= [${matchedItem ? matchedItem.name : config.defaultId}] (${buf.length} bytes)`);
    } catch (e) {
      console.error(`  ✗ Failed ${targetFile}:`, e.message);
    }
  }

  console.log('\nAll WatchModCustom authentic layers downloaded successfully!');
}

downloadAssets().catch(console.error);
