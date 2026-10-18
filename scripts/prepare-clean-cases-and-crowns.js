const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const layersDir = path.join(__dirname, '..', 'public', 'images', 'layers');
const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');

async function processCasesAndCrowns() {
  console.log('--- Processing Cases to remove baked-in crowns ---');

  // List of cases
  const caseFiles = [
    'case-sub-40-steel.png',
    'case-sub-40-pvd.png',
    'case-explorer-39.png',
    'case-datejust-36-rg.png',
    'case-skx-42.png',
    'case-daytona-39.png',
  ];

  for (const c of caseFiles) {
    const p = path.join(layersDir, c);
    if (!fs.existsSync(p)) continue;

    const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const buf = Buffer.from(data);

    // Make crown area (X >= 772, Y between 465 and 535) transparent
    let erased = 0;
    for (let y = 460; y <= 540; y++) {
      for (let x = 772; x < width; x++) {
        const idx = (y * width + x) * channels;
        if (buf[idx + 3] > 0) {
          buf[idx + 3] = 0; // Set alpha to 0
          buf[idx] = 0;
          buf[idx + 1] = 0;
          buf[idx + 2] = 0;
          erased++;
        }
      }
    }

    console.log(`  ✓ ${c}: erased ${erased} crown pixels (X >= 772, Y=460..540)`);
    await sharp(buf, { raw: { width, height, channels } })
      .png()
      .toFile(p);
  }

  console.log('\n--- Generating 4 Precise Crown Layers at 3 o\'clock (1000x1000) ---');

  // Crown definitions positioned precisely at 3 o'clock (center X=783, center Y=500, width=24, height=58)
  // 1. Big Crown 7.0mm Steel (screw-down knurled stainless steel crown)
  const bigCrownSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="steelCrown" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#808488"/>
      <stop offset="20%" stop-color="#d8dbde"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="80%" stop-color="#a8acb0"/>
      <stop offset="100%" stop-color="#55575a"/>
    </linearGradient>
    <linearGradient id="steelKnurl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#333"/>
      <stop offset="50%" stop-color="#fff"/>
      <stop offset="100%" stop-color="#333"/>
    </linearGradient>
    <filter id="crownShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="-1" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <g filter="url(#crownShadow)">
    <!-- Crown Stem / Base Collar -->
    <rect x="768" y="482" width="6" height="36" rx="2" fill="#808488"/>
    
    <!-- Crown Main Body with Rounded Cap -->
    <rect x="772" y="471" width="22" height="58" rx="4" fill="url(#steelCrown)"/>
    
    <!-- Precision Fluted Knurling Ridges -->
    <line x1="774" y1="475" x2="791" y2="475" stroke="#484a4c" stroke-width="1.5"/>
    <line x1="774" y1="480" x2="791" y2="480" stroke="#ffffff" stroke-width="1.2"/>
    <line x1="774" y1="485" x2="791" y2="485" stroke="#484a4c" stroke-width="1.5"/>
    <line x1="774" y1="490" x2="791" y2="490" stroke="#ffffff" stroke-width="1.2"/>
    <line x1="774" y1="495" x2="791" y2="495" stroke="#484a4c" stroke-width="1.5"/>
    <line x1="774" y1="500" x2="791" y2="500" stroke="#ffffff" stroke-width="1.2"/>
    <line x1="774" y1="505" x2="791" y2="505" stroke="#484a4c" stroke-width="1.5"/>
    <line x1="774" y1="510" x2="791" y2="510" stroke="#ffffff" stroke-width="1.2"/>
    <line x1="774" y1="515" x2="791" y2="515" stroke="#484a4c" stroke-width="1.5"/>
    <line x1="774" y1="520" x2="791" y2="520" stroke="#ffffff" stroke-width="1.2"/>
    <line x1="774" y1="525" x2="791" y2="525" stroke="#484a4c" stroke-width="1.5"/>

    <!-- Polished Outer End Dome -->
    <path d="M 792 473 Q 795 500 792 527" stroke="#ffffff" stroke-width="2" fill="none"/>
  </g>
</svg>`;

  // 2. Corona Moleteada con "S" Grabada 6.5mm (Yellow Gold)
  const signedGoldSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldCrown" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#a67c1e"/>
      <stop offset="25%" stop-color="#f5d77f"/>
      <stop offset="50%" stop-color="#fff8db"/>
      <stop offset="75%" stop-color="#e6b840"/>
      <stop offset="100%" stop-color="#8c6405"/>
    </linearGradient>
    <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="-1" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <g filter="url(#goldShadow)">
    <rect x="768" y="483" width="6" height="34" rx="2" fill="#8c6405"/>
    <rect x="772" y="473" width="20" height="54" rx="4" fill="url(#goldCrown)"/>

    <!-- Gold knurling -->
    <line x1="774" y1="478" x2="789" y2="478" stroke="#8c6405" stroke-width="1.5"/>
    <line x1="774" y1="483" x2="789" y2="483" stroke="#fff8db" stroke-width="1.2"/>
    <line x1="774" y1="488" x2="789" y2="488" stroke="#8c6405" stroke-width="1.5"/>
    <line x1="774" y1="493" x2="789" y2="493" stroke="#fff8db" stroke-width="1.2"/>
    <line x1="774" y1="498" x2="789" y2="498" stroke="#8c6405" stroke-width="1.5"/>
    <line x1="774" y1="503" x2="789" y2="503" stroke="#fff8db" stroke-width="1.2"/>
    <line x1="774" y1="508" x2="789" y2="508" stroke="#8c6405" stroke-width="1.5"/>
    <line x1="774" y1="513" x2="789" y2="513" stroke="#fff8db" stroke-width="1.2"/>
    <line x1="774" y1="518" x2="789" y2="518" stroke="#8c6405" stroke-width="1.5"/>
    <line x1="774" y1="523" x2="789" y2="523" stroke="#fff8db" stroke-width="1.2"/>

    <!-- Engraved Emblem 'S' on outer face -->
    <text x="789" y="503" font-family="serif" font-weight="bold" font-size="8" fill="#5c4103" text-anchor="middle" transform="rotate(90 789 500)">S</text>
    <path d="M 790 475 Q 793 500 790 525" stroke="#fff8db" stroke-width="1.5" fill="none"/>
  </g>
</svg>`;

  // 3. Corona Cebolla Acanalada Fluted (Rose Gold Pilot Onion)
  const onionRoseSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="roseCrown" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#995843"/>
      <stop offset="25%" stop-color="#e8a88a"/>
      <stop offset="50%" stop-color="#ffeedf"/>
      <stop offset="75%" stop-color="#c97759"/>
      <stop offset="100%" stop-color="#693322"/>
    </linearGradient>
    <filter id="roseShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="-1" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <g filter="url(#roseShadow)">
    <!-- Onion Bulb Shape -->
    <rect x="768" y="485" width="5" height="30" rx="2" fill="#693322"/>
    <ellipse cx="783" cy="500" rx="12" ry="28" fill="url(#roseCrown)"/>

    <!-- Fluted Onion Radial Fluting -->
    <line x1="773" y1="478" x2="792" y2="478" stroke="#693322" stroke-width="1.2"/>
    <line x1="772" y1="484" x2="794" y2="484" stroke="#ffeedf" stroke-width="1.2"/>
    <line x1="771" y1="490" x2="795" y2="490" stroke="#693322" stroke-width="1.2"/>
    <line x1="771" y1="496" x2="795" y2="496" stroke="#ffeedf" stroke-width="1.2"/>
    <line x1="771" y1="502" x2="795" y2="502" stroke="#693322" stroke-width="1.2"/>
    <line x1="771" y1="508" x2="795" y2="508" stroke="#ffeedf" stroke-width="1.2"/>
    <line x1="772" y1="514" x2="794" y2="514" stroke="#693322" stroke-width="1.2"/>
    <line x1="773" y1="520" x2="792" y2="520" stroke="#ffeedf" stroke-width="1.2"/>
    <line x1="775" y1="526" x2="790" y2="526" stroke="#693322" stroke-width="1.2"/>

    <path d="M 793 478 Q 796 500 793 522" stroke="#ffeedf" stroke-width="1.5" fill="none"/>
  </g>
</svg>`;

  // 4. Corona Tactical PVD Negro Mate (Matte Black PVD)
  const pvdBlackSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pvdCrown" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#18191a"/>
      <stop offset="25%" stop-color="#35373a"/>
      <stop offset="50%" stop-color="#4e5154"/>
      <stop offset="75%" stop-color="#2a2b2d"/>
      <stop offset="100%" stop-color="#0f0f10"/>
    </linearGradient>
    <filter id="pvdShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="-1" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <g filter="url(#pvdShadow)">
    <rect x="768" y="482" width="6" height="36" rx="2" fill="#121314"/>
    <rect x="772" y="471" width="22" height="58" rx="4" fill="url(#pvdCrown)"/>

    <!-- Matte DLC Knurling -->
    <line x1="774" y1="475" x2="791" y2="475" stroke="#0a0a0b" stroke-width="1.5"/>
    <line x1="774" y1="480" x2="791" y2="480" stroke="#5a5d61" stroke-width="1.2"/>
    <line x1="774" y1="485" x2="791" y2="485" stroke="#0a0a0b" stroke-width="1.5"/>
    <line x1="774" y1="490" x2="791" y2="490" stroke="#5a5d61" stroke-width="1.2"/>
    <line x1="774" y1="495" x2="791" y2="495" stroke="#0a0a0b" stroke-width="1.5"/>
    <line x1="774" y1="500" x2="791" y2="500" stroke="#5a5d61" stroke-width="1.2"/>
    <line x1="774" y1="505" x2="791" y2="505" stroke="#0a0a0b" stroke-width="1.5"/>
    <line x1="774" y1="510" x2="791" y2="510" stroke="#5a5d61" stroke-width="1.2"/>
    <line x1="774" y1="515" x2="791" y2="515" stroke="#0a0a0b" stroke-width="1.5"/>
    <line x1="774" y1="520" x2="791" y2="520" stroke="#5a5d61" stroke-width="1.2"/>
    <line x1="774" y1="525" x2="791" y2="525" stroke="#0a0a0b" stroke-width="1.5"/>

    <path d="M 792 473 Q 795 500 792 527" stroke="#686b70" stroke-width="1.5" fill="none"/>
  </g>
</svg>`;

  const crowns = [
    { file: 'crown-big-7mm.png', svg: bigCrownSvg },
    { file: 'crown-signed-65mm.png', svg: signedGoldSvg },
    { file: 'crown-onion-fluted.png', svg: onionRoseSvg },
    { file: 'crown-pvd-black.png', svg: pvdBlackSvg },
  ];

  for (const cr of crowns) {
    const layerPath = path.join(layersDir, cr.file);
    await sharp(Buffer.from(cr.svg))
      .png()
      .toFile(layerPath);

    console.log(`✓ Generated 1000x1000 crown layer: ${cr.file}`);
  }
}

processCasesAndCrowns().catch(console.error);
