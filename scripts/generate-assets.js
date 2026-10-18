/**
 * Chrono Swiss Luxury Horology - Photorealistic Watch Layer Generator
 * Produces ultra-high-definition watchmaker components for all 12 configurator categories.
 * All layers are rendered at 500x500 with transparent backgrounds, perfectly centered at (250, 250).
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'images', 'layers');
const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });

function saveLayer(filename, content) {
  const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <!-- Realistic Brushed Steel Gradients -->
    <linearGradient id="brushedSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="15%" stop-color="#e8eaed"/>
      <stop offset="35%" stop-color="#d0d3d6"/>
      <stop offset="50%" stop-color="#f5f6f8"/>
      <stop offset="65%" stop-color="#a8acb0"/>
      <stop offset="85%" stop-color="#d8dbde"/>
      <stop offset="100%" stop-color="#808488"/>
    </linearGradient>

    <linearGradient id="steelLugV" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8f9fa"/>
      <stop offset="20%" stop-color="#d5d8db"/>
      <stop offset="50%" stop-color="#b0b4b8"/>
      <stop offset="80%" stop-color="#e2e4e7"/>
      <stop offset="100%" stop-color="#909498"/>
    </linearGradient>

    <!-- PVD / DLC Tactical Black Steel -->
    <linearGradient id="pvdBlack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#404245"/>
      <stop offset="25%" stop-color="#222325"/>
      <stop offset="50%" stop-color="#2d2e30"/>
      <stop offset="75%" stop-color="#141516"/>
      <stop offset="100%" stop-color="#0a0a0b"/>
    </linearGradient>

    <!-- 18K Yellow Gold -->
    <linearGradient id="gold18k" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff8db"/>
      <stop offset="25%" stop-color="#f2cf66"/>
      <stop offset="50%" stop-color="#ffe699"/>
      <stop offset="75%" stop-color="#c9971c"/>
      <stop offset="100%" stop-color="#8c6405"/>
    </linearGradient>

    <!-- 18K Everose / Rose Gold -->
    <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffeedf"/>
      <stop offset="25%" stop-color="#e8a88a"/>
      <stop offset="50%" stop-color="#ffd5c2"/>
      <stop offset="75%" stop-color="#b86f52"/>
      <stop offset="100%" stop-color="#7a402a"/>
    </linearGradient>

    <!-- High-Reflectivity Ceramic Gloss -->
    <linearGradient id="ceramicBlack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a2c2e"/>
      <stop offset="45%" stop-color="#0f1011"/>
      <stop offset="50%" stop-color="#45484c"/>
      <stop offset="55%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1c1d1f"/>
    </linearGradient>

    <!-- Deep Sunburst Dials -->
    <radialGradient id="sunburstBlue" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1f5bb5"/>
      <stop offset="45%" stop-color="#14418a"/>
      <stop offset="80%" stop-color="#0b2452"/>
      <stop offset="100%" stop-color="#040f24"/>
    </radialGradient>

    <radialGradient id="sunburstGreen" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e7343"/>
      <stop offset="45%" stop-color="#134f2d"/>
      <stop offset="80%" stop-color="#0a2e1a"/>
      <stop offset="100%" stop-color="#03120a"/>
    </radialGradient>

    <radialGradient id="sunburstChampagne" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff6dd"/>
      <stop offset="50%" stop-color="#edd28c"/>
      <stop offset="85%" stop-color="#c4a356"/>
      <stop offset="100%" stop-color="#94762e"/>
    </radialGradient>

    <radialGradient id="sunburstSilver" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#f0f2f5"/>
      <stop offset="80%" stop-color="#d4d7dc"/>
      <stop offset="100%" stop-color="#a8abb0"/>
    </radialGradient>

    <radialGradient id="sunburstBlack" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#33363a"/>
      <stop offset="50%" stop-color="#1e2022"/>
      <stop offset="85%" stop-color="#111213"/>
      <stop offset="100%" stop-color="#080809"/>
    </radialGradient>

    <!-- Depth & Bevel Filters -->
    <filter id="shadowDepth" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.35"/>
    </filter>

    <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.45"/>
    </filter>

    <filter id="indexShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.2" stdDeviation="1" flood-color="#000000" flood-opacity="0.6"/>
    </filter>

    <filter id="lumeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Sapphire AR Glare Reflex Arc -->
    <linearGradient id="sapphireGlare" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00c8ff" stop-opacity="0.22"/>
      <stop offset="35%" stop-color="#0066ff" stop-opacity="0.08"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.0"/>
      <stop offset="100%" stop-color="#00b4d8" stop-opacity="0.15"/>
    </linearGradient>

    <!-- Super-LumiNova Pigment Gradient -->
    <linearGradient id="lumeGreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f0fff4"/>
      <stop offset="100%" stop-color="#bbf7d0"/>
    </linearGradient>
  </defs>
  ${content}
</svg>`;
  fs.writeFileSync(path.join(outDir, filename), fullSvg.trim());
}

console.log('Generating photorealistic Swiss watchmaker layers in public/images/layers/...');

// ── 01. MOVEMENTS (Caliber view with oscillating rotor, jewels & balance) ──
saveLayer('movement-nh35.svg', `
  <!-- Mainplate with pearlage & Côtes de Genève -->
  <circle cx="250" cy="250" r="118" fill="#d4d7db" stroke="#9da2a8" stroke-width="1.5"/>
  <circle cx="250" cy="250" r="115" fill="#e2e4e8" />
  <!-- Balance wheel aperture at 9 o'clock -->
  <circle cx="185" cy="250" r="28" fill="#181a1c" stroke="#555" stroke-width="1"/>
  <!-- Gold balance wheel with screws -->
  <circle cx="185" cy="250" r="22" fill="none" stroke="url(#gold18k)" stroke-width="2.5"/>
  <circle cx="185" cy="250" r="4" fill="#a31d1d" stroke="#f2cf66" stroke-width="1"/>
  <line x1="163" y1="250" x2="207" y2="250" stroke="url(#gold18k)" stroke-width="1.5"/>
  <line x1="185" y1="228" x2="185" y2="272" stroke="url(#gold18k)" stroke-width="1.5"/>
  <!-- Ruby Jewels -->
  <circle cx="250" cy="250" r="5" fill="#a81525" stroke="#f5cf6d" stroke-width="1.2"/>
  <circle cx="285" cy="210" r="3.5" fill="#a81525" stroke="#e0e3e8" stroke-width="1"/>
  <circle cx="295" cy="275" r="3.5" fill="#a81525" stroke="#e0e3e8" stroke-width="1"/>
  <!-- Oscillating Weighted Rotor (Semiciurcle with Côtes de Genève stripes) -->
  <path d="M 140 250 A 110 110 0 0 1 360 250 Z" fill="url(#brushedSteel)" stroke="#808488" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <path d="M 155 250 A 95 95 0 0 1 345 250 Z" fill="none" stroke="url(#gold18k)" stroke-width="3" stroke-dasharray="10 3"/>
  <!-- Central Ball Bearing Rotor Assembly -->
  <circle cx="250" cy="250" r="28" fill="url(#brushedSteel)" stroke="#666" stroke-width="1.5"/>
  <circle cx="250" cy="250" r="14" fill="#c4c8cd" stroke="#444" stroke-width="1"/>
  <!-- Rotor Engraved Inscription -->
  <text x="250" y="215" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8.5" font-weight="bold" letter-spacing="1.5" fill="#444648">CHRONO AUTOMATIC • 24 JEWELS</text>
  <text x="250" y="230" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="7" font-weight="600" letter-spacing="2" fill="#777a7e">CAL. NH35A • JAPAN</text>
`);

saveLayer('movement-nh34-gmt.svg', `
  <circle cx="250" cy="250" r="118" fill="#cfd2d6" stroke="#8c9196" stroke-width="1.5"/>
  <circle cx="185" cy="250" r="28" fill="#181a1c" stroke="#555" stroke-width="1"/>
  <circle cx="185" cy="250" r="22" fill="none" stroke="url(#gold18k)" stroke-width="2.5"/>
  <circle cx="185" cy="250" r="4" fill="#a31d1d" stroke="#f2cf66" stroke-width="1"/>
  <!-- Blue Blued Screws for Luxury GMT Caliber -->
  <circle cx="280" cy="200" r="3.5" fill="#1a4fb0" stroke="#0d2b63" stroke-width="0.8"/>
  <circle cx="295" cy="275" r="3.5" fill="#1a4fb0" stroke="#0d2b63" stroke-width="0.8"/>
  <circle cx="215" cy="300" r="3.5" fill="#1a4fb0" stroke="#0d2b63" stroke-width="0.8"/>
  <!-- Custom Skeletonized Gold Rotor -->
  <path d="M 140 250 A 110 110 0 0 1 360 250 Z" fill="url(#gold18k)" stroke="#8c6405" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <circle cx="250" cy="250" r="28" fill="url(#brushedSteel)" stroke="#666" stroke-width="1.5"/>
  <circle cx="250" cy="250" r="5" fill="#a81525" stroke="#f5cf6d" stroke-width="1.2"/>
  <text x="250" y="215" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8.5" font-weight="bold" letter-spacing="1.5" fill="#4d3a0c">GMT DUAL-TIME • 24 JEWELS</text>
  <text x="250" y="230" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="7" font-weight="600" letter-spacing="2" fill="#5c450e">CAL. NH34 • 21,600 BPH</text>
`);

saveLayer('movement-nh38-skeleton.svg', `
  <circle cx="250" cy="250" r="118" fill="#1b1c1e" stroke="#444" stroke-width="1.5"/>
  <!-- Skeletonized mainplate bridges showing gears -->
  <circle cx="250" cy="250" r="114" fill="#242628" />
  <circle cx="185" cy="250" r="32" fill="#0d0e0f" stroke="#e0b84c" stroke-width="1.5"/>
  <!-- Balance wheel in motion -->
  <circle cx="185" cy="250" r="25" fill="none" stroke="url(#gold18k)" stroke-width="3"/>
  <line x1="160" y1="250" x2="210" y2="250" stroke="url(#gold18k)" stroke-width="2"/>
  <line x1="185" y1="225" x2="185" y2="275" stroke="url(#gold18k)" stroke-width="2"/>
  <circle cx="185" cy="250" r="5" fill="#b01322" stroke="#fff" stroke-width="1"/>
  <!-- Gear train visible in skeleton cutouts -->
  <circle cx="270" cy="210" r="18" fill="none" stroke="url(#gold18k)" stroke-width="2" stroke-dasharray="2 2"/>
  <circle cx="300" cy="240" r="12" fill="none" stroke="url(#brushedSteel)" stroke-width="1.5" stroke-dasharray="2 1.5"/>
  <circle cx="250" cy="250" r="28" fill="url(#brushedSteel)" stroke="#555" stroke-width="1.5"/>
  <text x="250" y="295" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8" font-weight="bold" letter-spacing="1.5" fill="#888">OPEN HEART SKELETON CALIBER</text>
`);

// ── 02. CASES (Architectural brushed & polished luxury cases with open dial window) ──
saveLayer('case-sub-40-steel.svg', `
  <!-- Top & Bottom Lugs (Satin brushed, vertical direction) -->
  <path d="M 188 70 L 170 145 L 170 355 L 188 430 L 312 430 L 330 355 L 330 145 L 312 70 Z" fill="url(#steelLugV)" stroke="#8c9094" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <!-- Lug Polished Chamfers / Bevels -->
  <polygon points="188,70 170,145 182,145 198,70" fill="#ffffff" opacity="0.6"/>
  <polygon points="312,70 330,145 318,145 302,70" fill="#707478" opacity="0.5"/>
  <polygon points="188,430 170,355 182,355 198,430" fill="#ffffff" opacity="0.6"/>
  <polygon points="312,430 330,355 318,355 302,430" fill="#707478" opacity="0.5"/>
  <!-- Round Case Midsection (Mirror polished flanks) -->
  <circle cx="250" cy="250" r="150" fill="url(#brushedSteel)" stroke="#808488" stroke-width="2"/>
  <circle cx="250" cy="250" r="148" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
  <!-- Crown Guards at 3 o'clock -->
  <path d="M 335 224 L 358 235 L 358 265 L 335 276 Z" fill="url(#brushedSteel)" stroke="#707478" stroke-width="1.2"/>
  <polygon points="335,224 358,235 358,238 335,227" fill="#ffffff" opacity="0.7"/>
  <!-- Inner Bezel Seat & Hollow Dial Window (radius 126px is clear for dial) -->
  <circle cx="250" cy="250" r="130" fill="none" stroke="#505458" stroke-width="3"/>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#222" stroke-width="1"/>
`);

saveLayer('case-sub-40-pvd.svg', `
  <path d="M 188 70 L 170 145 L 170 355 L 188 430 L 312 430 L 330 355 L 330 145 L 312 70 Z" fill="url(#pvdBlack)" stroke="#1a1b1c" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <polygon points="188,70 170,145 182,145 198,70" fill="#505255" opacity="0.6"/>
  <polygon points="312,70 330,145 318,145 302,70" fill="#111213" opacity="0.8"/>
  <circle cx="250" cy="250" r="150" fill="url(#pvdBlack)" stroke="#1e2022" stroke-width="2"/>
  <circle cx="250" cy="250" r="148" fill="none" stroke="#484a4c" stroke-width="1" opacity="0.6"/>
  <path d="M 335 224 L 358 235 L 358 265 L 335 276 Z" fill="url(#pvdBlack)" stroke="#1a1b1c" stroke-width="1.2"/>
  <circle cx="250" cy="250" r="130" fill="none" stroke="#111213" stroke-width="3"/>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#050505" stroke-width="1"/>
`);

saveLayer('case-datejust-36-rg.svg', `
  <path d="M 194 85 L 178 150 L 178 350 L 194 415 L 306 415 L 322 350 L 322 150 L 306 85 Z" fill="url(#roseGold)" stroke="#9c5638" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <polygon points="194,85 178,150 188,150 202,85" fill="#ffeedf" opacity="0.7"/>
  <circle cx="250" cy="250" r="145" fill="url(#roseGold)" stroke="#8c4b2f" stroke-width="2"/>
  <circle cx="250" cy="250" r="143" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.6"/>
  <circle cx="250" cy="250" r="128" fill="none" stroke="#7a3f27" stroke-width="2.5"/>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#421f11" stroke-width="1"/>
`);

saveLayer('case-explorer-39.svg', `
  <path d="M 190 75 L 172 148 L 172 352 L 190 425 L 310 425 L 328 352 L 328 148 L 310 75 Z" fill="url(#steelLugV)" stroke="#8c9094" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <polygon points="190,75 172,148 184,148 200,75" fill="#ffffff" opacity="0.7"/>
  <circle cx="250" cy="250" r="148" fill="url(#brushedSteel)" stroke="#808488" stroke-width="2"/>
  <circle cx="250" cy="250" r="146" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
  <circle cx="250" cy="250" r="129" fill="none" stroke="#505458" stroke-width="3"/>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#222" stroke-width="1"/>
`);

saveLayer('case-skx-42.svg', `
  <!-- Asymmetric Diver Case with 4 o'clock Crown Guard -->
  <path d="M 184 65 L 165 142 L 165 358 L 184 435 L 316 435 L 335 358 L 335 142 L 316 65 Z" fill="url(#steelLugV)" stroke="#808488" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <circle cx="250" cy="250" r="154" fill="url(#brushedSteel)" stroke="#787c80" stroke-width="2"/>
  <!-- Iconic SKX Crown Guard at 4 o'clock (around angle 40 deg down) -->
  <path d="M 330 280 L 358 300 L 352 324 L 320 318 Z" fill="url(#brushedSteel)" stroke="#707478" stroke-width="1.2"/>
  <circle cx="250" cy="250" r="130" fill="none" stroke="#505458" stroke-width="3"/>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#222" stroke-width="1"/>
`);

saveLayer('case-daytona-39.svg', `
  <path d="M 190 75 L 172 148 L 172 352 L 190 425 L 310 425 L 328 352 L 328 148 L 310 75 Z" fill="url(#steelLugV)" stroke="#8c9094" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <circle cx="250" cy="250" r="148" fill="url(#brushedSteel)" stroke="#808488" stroke-width="2"/>
  <!-- Chronograph screw-down pushers at 2 and 4 o'clock -->
  <rect x="335" y="180" width="18" height="12" rx="2" fill="url(#brushedSteel)" stroke="#666" stroke-width="1" transform="rotate(-25 344 186)"/>
  <rect x="335" y="308" width="18" height="12" rx="2" fill="url(#brushedSteel)" stroke="#666" stroke-width="1" transform="rotate(25 344 314)"/>
  <path d="M 335 230 L 354 238 L 354 262 L 335 270 Z" fill="url(#brushedSteel)" stroke="#666" stroke-width="1"/>
  <circle cx="250" cy="250" r="129" fill="none" stroke="#505458" stroke-width="3"/>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#222" stroke-width="1"/>
`);

// ── 03. DIALS (Full 10 Dials: 3D Faceted Lumed Indices, Minute Tracks, Sunbursts) ──
function generateDial(bgFill, markerFill, markerStroke, lumeColor = '#e0fde5', extraDecor = '') {
  let markers = '';
  // 12 applied faceted hour markers
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * Math.PI / 180;
    const isMajor = i % 3 === 0;
    const rOuter = 114;
    const rInner = isMajor ? (i === 0 ? 94 : 96) : 100;
    const x1 = 250 + rInner * Math.sin(angle);
    const y1 = 250 - rInner * Math.cos(angle);
    const x2 = 250 + rOuter * Math.sin(angle);
    const y2 = 250 - rOuter * Math.cos(angle);
    const width = isMajor ? 5.5 : 4;

    if (i === 0) {
      // 12 o'clock double baton
      const offset = 4;
      markers += `
        <line x1="${x1 - offset}" y1="${y1}" x2="${x2 - offset}" y2="${y2}" stroke="${markerFill}" stroke-width="${width}" stroke-linecap="square" filter="url(#indexShadow)"/>
        <line x1="${x1 - offset}" y1="${y1}" x2="${x2 - offset}" y2="${y2}" stroke="${lumeColor}" stroke-width="${width - 2}" stroke-linecap="square"/>
        <line x1="${x1 + offset}" y1="${y1}" x2="${x2 + offset}" y2="${y2}" stroke="${markerFill}" stroke-width="${width}" stroke-linecap="square" filter="url(#indexShadow)"/>
        <line x1="${x1 + offset}" y1="${y1}" x2="${x2 + offset}" y2="${y2}" stroke="${lumeColor}" stroke-width="${width - 2}" stroke-linecap="square"/>
      `;
    } else {
      markers += `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${markerFill}" stroke-width="${width}" stroke-linecap="square" filter="url(#indexShadow)"/>
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lumeColor}" stroke-width="${width - 2}" stroke-linecap="square"/>
      `;
    }
  }

  // 60-second railway perimeter tick marks
  let ticks = '';
  for (let m = 0; m < 60; m++) {
    if (m % 5 === 0) continue;
    const a = (m * 6) * Math.PI / 180;
    const rx1 = 250 + 118 * Math.sin(a);
    const ry1 = 250 - 118 * Math.cos(a);
    const rx2 = 250 + 122 * Math.sin(a);
    const ry2 = 250 - 122 * Math.cos(a);
    ticks += `<line x1="${rx1}" y1="${ry1}" x2="${rx2}" y2="${ry2}" stroke="${markerStroke}" stroke-width="1" opacity="0.6"/>`;
  }

  return `
    <circle cx="250" cy="250" r="125" fill="${bgFill}" />
    <!-- Subtle Sunburst Radial Sheen Lines -->
    <path d="M 250 250 L 140 140 A 125 125 0 0 1 360 140 Z" fill="#ffffff" opacity="0.04"/>
    <path d="M 250 250 L 360 360 A 125 125 0 0 1 140 360 Z" fill="#ffffff" opacity="0.04"/>
    ${extraDecor}
    <g>${ticks}</g>
    <g>${markers}</g>
    <!-- Brand Horology Logo Inscription -->
    <text x="250" y="195" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="700" letter-spacing="3" fill="${markerStroke}">CHRONO</text>
    <text x="250" y="206" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="5" font-weight="600" letter-spacing="1.5" fill="${markerStroke}" opacity="0.8">AUTOMATIC</text>
    <!-- Depth & Water Resistance Rating -->
    <text x="250" y="300" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="5.5" font-weight="600" letter-spacing="1.5" fill="${markerStroke}" opacity="0.75">660 ft = 200 m</text>
    <text x="250" y="310" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="4.5" font-weight="500" letter-spacing="1" fill="${markerStroke}" opacity="0.6">SUPERLATIVE CHRONOMETER</text>
    <!-- Swiss Made / Japan Made Footprint -->
    <text x="250" y="365" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="4.5" letter-spacing="1" fill="${markerStroke}" opacity="0.5">MADE IN JAPAN</text>
    <!-- Pin Center Hole -->
    <circle cx="250" cy="250" r="4" fill="#0b0c0d" stroke="${markerFill}" stroke-width="1.5"/>
  `;
}

saveLayer('dial-marine-blue.svg', generateDial('url(#sunburstBlue)', 'url(#brushedSteel)', '#e8f0fe', '#d0f0fd'));
saveLayer('dial-sub-black.svg', generateDial('url(#sunburstBlack)', 'url(#brushedSteel)', '#f0f3f6', '#dcfce7'));
saveLayer('dial-racing-green.svg', generateDial('url(#sunburstGreen)', 'url(#gold18k)', '#ffd573', '#e4fde1'));
saveLayer('dial-champagne.svg', generateDial('url(#sunburstChampagne)', 'url(#gold18k)', '#5e4308', '#fff8db'));
saveLayer('dial-matte-white.svg', generateDial('url(#sunburstSilver)', '#1c1d1f', '#18191a', '#e2e8f0'));
saveLayer('dial-vintage-cream.svg', generateDial('url(#vintageCream)', 'url(#gold18k)', '#594420', '#fde68a'));

saveLayer('dial-mop-white.svg', generateDial('url(#sunburstSilver)', 'url(#roseGold)', '#6e4433', '#fdf4ff', `
  <!-- Natural Mother of Pearl Iridescent Swirls -->
  <path d="M 150 200 Q 220 180 270 230 T 350 220" fill="none" stroke="#fce7f3" stroke-width="20" opacity="0.3" filter="url(#lumeGlow)"/>
  <path d="M 170 300 Q 240 260 310 310" fill="none" stroke="#e0f2fe" stroke-width="25" opacity="0.3" filter="url(#lumeGlow)"/>
`));

saveLayer('dial-forged-carbon.svg', generateDial('url(#pvdBlack)', 'url(#brushedSteel)', '#4ade80', '#22c55e', `
  <!-- Forged Carbon Organic Marble Texture -->
  <path d="M 160 160 Q 210 190 230 150 T 320 180" fill="none" stroke="#33373b" stroke-width="14" opacity="0.7"/>
  <path d="M 140 280 Q 220 240 290 290 T 350 250" fill="none" stroke="#25282a" stroke-width="18" opacity="0.8"/>
  <path d="M 180 220 Q 230 260 260 210" fill="none" stroke="#3d4247" stroke-width="12" opacity="0.6"/>
`));

saveLayer('dial-meteorite.svg', generateDial('#d1d5db', '#111827', '#374151', '#f3f4f6', `
  <!-- Authentic Widmanstatten Crystalline Crosshatch -->
  <g stroke="#9ca3af" stroke-width="1.2" opacity="0.5">
    <line x1="140" y1="160" x2="360" y2="340"/>
    <line x1="160" y1="140" x2="340" y2="360"/>
    <line x1="130" y1="280" x2="350" y2="170"/>
    <line x1="170" y1="360" x2="370" y2="240"/>
    <line x1="180" y1="130" x2="310" y2="370"/>
  </g>
`));

saveLayer('dial-open-heart.svg', generateDial('url(#sunburstBlack)', 'url(#brushedSteel)', '#ffffff', '#e2e8f0', `
  <!-- Open Heart Skeleton Window at 9 o'clock -->
  <circle cx="185" cy="250" r="26" fill="#0d0e0f" stroke="url(#brushedSteel)" stroke-width="2.5" filter="url(#indexShadow)"/>
  <!-- Exposed Moving Balance & Ruby -->
  <circle cx="185" cy="250" r="20" fill="none" stroke="url(#gold18k)" stroke-width="2"/>
  <circle cx="185" cy="250" r="4" fill="#a81525" stroke="#fff" stroke-width="0.8"/>
`));

// ── 04. BEZELS (Gloss Ceramic, Fluted Steel, Pepsi, Batman) ──
function generateDiverBezel(fill1, fill2 = null, numColor = '#f5f6f8') {
  let numerals = '';
  const labels = ['10', '20', '30', '40', '50'];
  labels.forEach((num, idx) => {
    const angle = (idx + 1) * 60;
    const rad = angle * Math.PI / 180;
    const x = 250 + 138 * Math.sin(rad);
    const y = 250 - 138 * Math.cos(rad);
    numerals += `<text x="${x}" y="${y + 4.5}" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" font-weight="800" fill="${numColor}">${num}</text>`;
  });

  return `
    <!-- Ceramic Outer Bezel Ring -->
    ${fill2 ? `
      <!-- Bi-Color Split (e.g. Pepsi, Batman) -->
      <path d="M 102 250 A 148 148 0 0 1 398 250 Z" fill="${fill1}" stroke="#111" stroke-width="1.5" filter="url(#shadowDepth)"/>
      <path d="M 398 250 A 148 148 0 0 1 102 250 Z" fill="${fill2}" stroke="#111" stroke-width="1.5" filter="url(#shadowDepth)"/>
    ` : `
      <circle cx="250" cy="250" r="148" fill="${fill1}" stroke="#111" stroke-width="1.5" filter="url(#shadowDepth)"/>
    `}
    <!-- Center Opening for Dial -->
    <circle cx="250" cy="250" r="126" fill="none" stroke="#222" stroke-width="1.5"/>
    <!-- 12 o'clock Luminous Diver Pip Triangle -->
    <polygon points="250,110 242,122 258,122" fill="#ffffff"/>
    <circle cx="250" cy="118" r="3.2" fill="#bbf7d0" stroke="#333" stroke-width="0.8" filter="url(#lumeGlow)"/>
    <!-- 10, 20, 30, 40, 50 Numerals -->
    ${numerals}
    <!-- Knurled Outer Coin Grip Rim -->
    <circle cx="250" cy="250" r="149" fill="none" stroke="url(#brushedSteel)" stroke-width="2" stroke-dasharray="3 2"/>
  `;
}

saveLayer('bezel-ceramic-black.svg', generateDiverBezel('url(#ceramicBlack)'));
saveLayer('bezel-pepsi.svg', generateDiverBezel('#0f326e', '#941919'));
saveLayer('bezel-batman.svg', generateDiverBezel('#0a0b0c', '#10459c'));
saveLayer('bezel-smooth-steel.svg', `
  <circle cx="250" cy="250" r="148" fill="url(#brushedSteel)" stroke="#808488" stroke-width="1.5" filter="url(#shadowDepth)"/>
  <circle cx="250" cy="250" r="146" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#333" stroke-width="1.5"/>
`);

saveLayer('bezel-fluted-steel.svg', `
  <!-- Fluted Bezel: 60 Precision Cut Light Refracting Facets -->
  <g filter="url(#shadowDepth)">
    ${Array.from({ length: 60 }, (_, i) => {
      const a1 = (i * 6) * Math.PI / 180;
      const a2 = ((i + 1) * 6) * Math.PI / 180;
      const x1 = 250 + 148 * Math.sin(a1);
      const y1 = 250 - 148 * Math.cos(a1);
      const x2 = 250 + 148 * Math.sin(a2);
      const y2 = 250 - 148 * Math.cos(a2);
      const xi1 = 250 + 126 * Math.sin(a1);
      const yi1 = 250 - 126 * Math.cos(a1);
      const xi2 = 250 + 126 * Math.sin(a2);
      const yi2 = 250 - 126 * Math.cos(a2);
      const isHighlight = i % 2 === 0;
      return `<polygon points="${x1},${y1} ${x2},${y2} ${xi2},${yi2} ${xi1},${yi1}" fill="${isHighlight ? '#ffffff' : '#a8acb0'}" stroke="#707478" stroke-width="0.4"/>`;
    }).join('')}
  </g>
  <circle cx="250" cy="250" r="126" fill="none" stroke="#444" stroke-width="1"/>
`);

// ── 05. HANDS (3D Faceted Hands casting realistic drop shadow) ──
saveLayer('hands-mercedes-silver.svg', `
  <g filter="url(#handShadow)">
    <!-- Hour Hand: Iconic Mercedes 3-pointed Star Circle (Angle pointing at 10:10 -> 300 deg) -->
    <g transform="rotate(-60 250 250)">
      <polygon points="247,250 248,190 250,184 252,190 253,250" fill="url(#brushedSteel)" stroke="#555" stroke-width="0.8"/>
      <!-- Mercedes Circle -->
      <circle cx="250" cy="188" r="9" fill="url(#brushedSteel)" stroke="#555" stroke-width="1"/>
      <circle cx="250" cy="188" r="7" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
      <line x1="250" y1="181" x2="250" y2="188" stroke="url(#brushedSteel)" stroke-width="1"/>
      <line x1="250" y1="188" x2="244" y2="192" stroke="url(#brushedSteel)" stroke-width="1"/>
      <line x1="250" y1="188" x2="256" y2="192" stroke="url(#brushedSteel)" stroke-width="1"/>
      <polygon points="248,179 250,172 252,179" fill="url(#brushedSteel)"/>
    </g>
    <!-- Minute Hand: Elegant Tapered Sword pointing at 1:50 -> 50 deg -->
    <g transform="rotate(50 250 250)">
      <polygon points="247,250 248,150 250,140 252,150 253,250" fill="url(#brushedSteel)" stroke="#555" stroke-width="0.8"/>
      <polygon points="248,235 249,155 251,155 252,235" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
      <polygon points="248,150 250,140 252,150" fill="url(#brushedSteel)"/>
    </g>
    <!-- Center Pin Cap -->
    <circle cx="250" cy="250" r="4.5" fill="url(#brushedSteel)" stroke="#444" stroke-width="1"/>
    <circle cx="250" cy="250" r="1.5" fill="#111"/>
  </g>
`);

saveLayer('hands-mercedes-gold.svg', `
  <g filter="url(#handShadow)">
    <g transform="rotate(-60 250 250)">
      <polygon points="247,250 248,190 250,184 252,190 253,250" fill="url(#gold18k)" stroke="#735308" stroke-width="0.8"/>
      <circle cx="250" cy="188" r="9" fill="url(#gold18k)" stroke="#735308" stroke-width="1"/>
      <circle cx="250" cy="188" r="7" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
      <line x1="250" y1="181" x2="250" y2="188" stroke="url(#gold18k)" stroke-width="1"/>
      <line x1="250" y1="188" x2="244" y2="192" stroke="url(#gold18k)" stroke-width="1"/>
      <line x1="250" y1="188" x2="256" y2="192" stroke="url(#gold18k)" stroke-width="1"/>
      <polygon points="248,179 250,172 252,179" fill="url(#gold18k)"/>
    </g>
    <g transform="rotate(50 250 250)">
      <polygon points="247,250 248,150 250,140 252,150 253,250" fill="url(#gold18k)" stroke="#735308" stroke-width="0.8"/>
      <polygon points="248,235 249,155 251,155 252,235" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
      <polygon points="248,150 250,140 252,150" fill="url(#gold18k)"/>
    </g>
    <circle cx="250" cy="250" r="4.5" fill="url(#gold18k)" stroke="#735308" stroke-width="1"/>
    <circle cx="250" cy="250" r="1.5" fill="#222"/>
  </g>
`);

saveLayer('hands-sword-silver.svg', `
  <g filter="url(#handShadow)">
    <g transform="rotate(-60 250 250)">
      <polygon points="246,250 246,180 250,170 254,180 254,250" fill="url(#brushedSteel)" stroke="#444" stroke-width="0.8"/>
      <polygon points="247.5,235 247.5,182 250,174 252.5,182 252.5,235" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
    </g>
    <g transform="rotate(50 250 250)">
      <polygon points="246.5,250 246.5,145 250,135 253.5,145 253.5,250" fill="url(#brushedSteel)" stroke="#444" stroke-width="0.8"/>
      <polygon points="248,235 248,148 250,140 252,148 252,235" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
    </g>
    <circle cx="250" cy="250" r="4.5" fill="url(#brushedSteel)" stroke="#444" stroke-width="1"/>
  </g>
`);

saveLayer('hands-snowflake-silver.svg', `
  <g filter="url(#handShadow)">
    <!-- Snowflake Tudor Hour Hand with Diamond Head -->
    <g transform="rotate(-60 250 250)">
      <polygon points="247,250 247,195 253,195 253,250" fill="url(#brushedSteel)" stroke="#444" stroke-width="0.8"/>
      <!-- Diamond Snowflake -->
      <polygon points="250,175 258,185 250,195 242,185" fill="url(#brushedSteel)" stroke="#444" stroke-width="0.8"/>
      <polygon points="250,177 256,185 250,193 244,185" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
      <polygon points="248,175 250,170 252,175" fill="url(#brushedSteel)"/>
    </g>
    <g transform="rotate(50 250 250)">
      <polygon points="247,250 247,145 250,138 253,145 253,250" fill="url(#brushedSteel)" stroke="#444" stroke-width="0.8"/>
      <polygon points="248.5,235 248.5,148 250,143 251.5,148 251.5,235" fill="url(#lumeGreen)" filter="url(#lumeGlow)"/>
    </g>
    <circle cx="250" cy="250" r="4.5" fill="url(#brushedSteel)" stroke="#444" stroke-width="1"/>
  </g>
`);

saveLayer('hands-baton-black.svg', `
  <g filter="url(#handShadow)">
    <g transform="rotate(-60 250 250)">
      <rect x="247.5" y="175" width="5" height="75" rx="1" fill="#141517" stroke="#333" stroke-width="0.8"/>
      <rect x="249" y="180" width="2" height="60" fill="#e2e8f0"/>
    </g>
    <g transform="rotate(50 250 250)">
      <rect x="248" y="140" width="4" height="110" rx="1" fill="#141517" stroke="#333" stroke-width="0.8"/>
      <rect x="249" y="145" width="2" height="95" fill="#e2e8f0"/>
    </g>
    <circle cx="250" cy="250" r="4.5" fill="#141517" stroke="#444" stroke-width="1"/>
  </g>
`);

saveLayer('hands-cathedral-vintage.svg', `
  <g filter="url(#handShadow)">
    <g transform="rotate(-60 250 250)">
      <path d="M 248 250 L 248 205 Q 242 195 245 185 Q 250 170 250 165 Q 250 170 255 185 Q 258 195 252 205 L 252 250 Z" fill="url(#roseGold)" stroke="#663322" stroke-width="0.8"/>
      <circle cx="250" cy="188" r="4.5" fill="#fef08a" opacity="0.9"/>
    </g>
    <g transform="rotate(50 250 250)">
      <polygon points="247.5,250 248,148 250,138 252,148 252.5,250" fill="url(#roseGold)" stroke="#663322" stroke-width="0.8"/>
      <polygon points="248.5,235 249,150 250,143 251,150 251.5,235" fill="#fef08a" opacity="0.9"/>
    </g>
    <circle cx="250" cy="250" r="4.5" fill="url(#roseGold)" stroke="#663322" stroke-width="1"/>
  </g>
`);

// ── 06. SECOND HANDS (Ultra-thin needle with colored pointer) ──
saveLayer('second-lightning-orange.svg', `
  <!-- Milgauss Style Zigzag Electric Lightning Bolt pointing to ~28 seconds (168 deg) -->
  <g filter="url(#handShadow)" transform="rotate(168 250 250)">
    <!-- Counterweight -->
    <circle cx="250" cy="275" r="3.5" fill="#ea580c"/>
    <line x1="250" y1="250" x2="250" y2="282" stroke="#ea580c" stroke-width="1.2"/>
    <!-- Lightning Zigzag -->
    <polyline points="250,250 250,215 254,208 248,198 253,190 250,182 250,136" fill="none" stroke="#ea580c" stroke-width="1.8" stroke-linecap="round"/>
    <polygon points="248,138 250,130 252,138" fill="#ea580c"/>
    <circle cx="250" cy="250" r="3" fill="#ffffff" stroke="#c2410c" stroke-width="1"/>
  </g>
`);

saveLayer('second-red-tip.svg', `
  <g filter="url(#handShadow)" transform="rotate(168 250 250)">
    <circle cx="250" cy="276" r="3" fill="url(#brushedSteel)" stroke="#555" stroke-width="0.8"/>
    <line x1="250" y1="250" x2="250" y2="282" stroke="url(#brushedSteel)" stroke-width="1"/>
    <!-- Needle body -->
    <line x1="250" y1="250" x2="250" y2="155" stroke="url(#brushedSteel)" stroke-width="1"/>
    <!-- Red Tip Pointer -->
    <line x1="250" y1="155" x2="250" y2="132" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="250" cy="250" r="2.8" fill="url(#brushedSteel)" stroke="#333" stroke-width="0.8"/>
  </g>
`);

saveLayer('second-arrow-blue.svg', `
  <g filter="url(#handShadow)" transform="rotate(168 250 250)">
    <circle cx="250" cy="276" r="3" fill="#1d4ed8"/>
    <line x1="250" y1="250" x2="250" y2="282" stroke="#1d4ed8" stroke-width="1"/>
    <line x1="250" y1="250" x2="250" y2="142" stroke="#1d4ed8" stroke-width="1"/>
    <polygon points="247,144 250,132 253,144" fill="#1d4ed8"/>
    <circle cx="250" cy="250" r="2.8" fill="#ffffff" stroke="#1e40af" stroke-width="1"/>
  </g>
`);

saveLayer('second-lollipop-green.svg', `
  <g filter="url(#handShadow)" transform="rotate(168 250 250)">
    <line x1="250" y1="250" x2="250" y2="280" stroke="url(#brushedSteel)" stroke-width="1"/>
    <line x1="250" y1="250" x2="250" y2="134" stroke="url(#brushedSteel)" stroke-width="1"/>
    <!-- Luminous Lollipop Ring near tip -->
    <circle cx="250" cy="155" r="5" fill="#22c55e" stroke="url(#brushedSteel)" stroke-width="1" filter="url(#lumeGlow)"/>
    <circle cx="250" cy="250" r="2.8" fill="url(#brushedSteel)" stroke="#333" stroke-width="0.8"/>
  </g>
`);

saveLayer('second-classic-rhodium.svg', `
  <g filter="url(#handShadow)" transform="rotate(168 250 250)">
    <circle cx="250" cy="275" r="3" fill="url(#brushedSteel)" stroke="#555" stroke-width="0.8"/>
    <line x1="250" y1="250" x2="250" y2="280" stroke="url(#brushedSteel)" stroke-width="0.9"/>
    <line x1="250" y1="250" x2="250" y2="132" stroke="url(#brushedSteel)" stroke-width="0.9"/>
    <circle cx="250" cy="250" r="2.8" fill="url(#brushedSteel)" stroke="#333" stroke-width="0.8"/>
  </g>
`);

// ── 07. CROWNS (Positioned precisely at 3 o'clock on the case flank) ──
saveLayer('crown-big-7mm.svg', `
  <g filter="url(#shadowDepth)">
    <!-- 7mm Fluted Big Crown protruding at 3 o'clock: x=348..368, y=238..262 -->
    <rect x="346" y="238" width="22" height="24" rx="3" fill="url(#brushedSteel)" stroke="#666" stroke-width="1.2"/>
    <!-- Deep Knurling Grips -->
    ${[240, 243, 246, 249, 252, 255, 258, 261].map(y => `
      <line x1="347" y1="${y}" x2="367" y2="${y}" stroke="#444" stroke-width="1"/>
    `).join('')}
  </g>
`);

saveLayer('crown-signed-65mm.svg', `
  <g filter="url(#shadowDepth)">
    <rect x="346" y="240" width="18" height="20" rx="3" fill="url(#brushedSteel)" stroke="#666" stroke-width="1.2"/>
    ${[242, 245, 248, 251, 254, 257].map(y => `
      <line x1="347" y1="${y}" x2="363" y2="${y}" stroke="#444" stroke-width="0.9"/>
    `).join('')}
    <!-- Embossed "S" Logo on Crown Cap -->
    <text x="360" y="253" font-family="'Helvetica Neue', Arial, sans-serif" font-size="7" font-weight="bold" fill="#333">S</text>
  </g>
`);

saveLayer('crown-onion-fluted.svg', `
  <g filter="url(#shadowDepth)">
    <ellipse cx="356" cy="250" rx="10" ry="12" fill="url(#brushedSteel)" stroke="#666" stroke-width="1.2"/>
    ${Array.from({ length: 9 }, (_, i) => {
      const a = (i - 4) * 12 * Math.PI / 180;
      return `<line x1="346" y1="250" x2="${356 + 10 * Math.cos(a)}" y2="${250 + 12 * Math.sin(a)}" stroke="#555" stroke-width="1"/>`;
    }).join('')}
  </g>
`);

saveLayer('crown-pvd-black.svg', `
  <g filter="url(#shadowDepth)">
    <rect x="346" y="239" width="20" height="22" rx="3" fill="url(#pvdBlack)" stroke="#111" stroke-width="1.2"/>
    ${[242, 245, 248, 251, 254, 257].map(y => `
      <line x1="347" y1="${y}" x2="365" y2="${y}" stroke="#0a0a0b" stroke-width="1"/>
    `).join('')}
  </g>
`);

// ── 08. CRYSTALS (Anti-Reflective Sapphire with Optical Blue Arcs) ──
saveLayer('crystal-flat-ar-blue.svg', `
  <!-- Transparent scratch-proof sapphire crystal dome with AR blue sheen arc -->
  <circle cx="250" cy="250" r="126" fill="url(#sapphireGlare)" />
  <!-- Upper Right Specular Highlight Arc -->
  <path d="M 190 145 A 120 120 0 0 1 350 200" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.35" stroke-linecap="round"/>
  <path d="M 180 155 A 116 116 0 0 1 340 210" fill="none" stroke="#00e5ff" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
`);

saveLayer('crystal-double-domed.svg', `
  <circle cx="250" cy="250" r="126" fill="url(#sapphireGlare)" />
  <!-- Vintage Double Domed Curved Light Edge Refraction -->
  <circle cx="250" cy="250" r="123" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.45"/>
  <path d="M 170 160 A 118 118 0 0 1 330 180" fill="none" stroke="#ffffff" stroke-width="3.5" opacity="0.4" stroke-linecap="round"/>
`);

saveLayer('crystal-top-hat-box.svg', `
  <circle cx="250" cy="250" r="126" fill="url(#sapphireGlare)" />
  <!-- Box Top Hat Cylinder Rim Reflection -->
  <circle cx="250" cy="250" r="124" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.55"/>
  <circle cx="250" cy="250" r="120" fill="none" stroke="#00b4d8" stroke-width="1.2" opacity="0.35"/>
`);

// ── 09. CHAPTER RINGS (Inner angled rehaut with minutes marks) ──
function generateChapterRing(fillColor, tickColor) {
  let marks = '';
  for (let m = 0; m < 60; m++) {
    const a = (m * 6) * Math.PI / 180;
    const isMajor = m % 5 === 0;
    const r1 = isMajor ? 120 : 122;
    const r2 = 126;
    const x1 = 250 + r1 * Math.sin(a);
    const y1 = 250 - r1 * Math.cos(a);
    const x2 = 250 + r2 * Math.sin(a);
    const y2 = 250 - r2 * Math.cos(a);
    marks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${tickColor}" stroke-width="${isMajor ? 1.5 : 0.8}" />`;
  }

  return `
    <!-- Angled Rehaut Ring between r=120 and r=126 -->
    <path d="M 124 250 A 126 126 0 1 0 376 250 A 126 126 0 1 0 124 250 M 130 250 A 120 120 0 1 1 370 250 A 120 120 0 1 1 130 250 Z" fill="${fillColor}" stroke="#333" stroke-width="0.8"/>
    <g>${marks}</g>
  `;
}

saveLayer('chapter-brushed-silver.svg', generateChapterRing('url(#brushedSteel)', '#222'));
saveLayer('chapter-matte-black.svg', generateChapterRing('url(#pvdBlack)', '#ffffff'));
saveLayer('chapter-polished-gold.svg', generateChapterRing('url(#gold18k)', '#422e03'));
saveLayer('chapter-lumed-diver.svg', `
  ${generateChapterRing('url(#pvdBlack)', '#e2e8f0')}
  <!-- Glowing Lumed Block Pips every 5 minutes -->
  ${Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30) * Math.PI / 180;
    const x = 250 + 122 * Math.sin(a);
    const y = 250 - 122 * Math.cos(a);
    return `<circle cx="${x}" cy="${y}" r="1.8" fill="#4ade80" filter="url(#lumeGlow)"/>`;
  }).join('')}
`);

saveLayer('chapter-arabic-track.svg', `
  ${generateChapterRing('url(#vintageCream)', '#3a2e1c')}
  <!-- Arabic Numbers 05-60 printed on Chapter Ring -->
  ${['05','10','15','20','25','30','35','40','45','50','55','60'].map((txt, i) => {
    const a = ((i + 1) * 30) * Math.PI / 180;
    const x = 250 + 123 * Math.sin(a);
    const y = 250 - 123 * Math.cos(a);
    return `<text x="${x}" y="${y + 2}" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="5" font-weight="700" fill="#3a2e1c">${txt}</text>`;
  }).join('')}
`);

// ── 10. STRAPS / BRACELETS (Pass through center vertically, behind case) ──
saveLayer('strap-oyster-steel.svg', `
  <g filter="url(#shadowDepth)">
    <!-- 3-Link Solid Brushed Steel Oyster Bracelet (Runs from y=0 to y=500, width=160px) -->
    ${[10, 45, 80, 115, 385, 420, 455, 490].map(y => `
      <!-- Center Link (Wide Brushed Steel) -->
      <rect x="200" y="${y - 15}" width="100" height="32" rx="2" fill="url(#brushedSteel)" stroke="#808488" stroke-width="1"/>
      <!-- Left Outer Link -->
      <rect x="170" y="${y - 15}" width="28" height="32" rx="2" fill="url(#steelLugV)" stroke="#808488" stroke-width="1"/>
      <!-- Right Outer Link -->
      <rect x="302" y="${y - 15}" width="28" height="32" rx="2" fill="url(#steelLugV)" stroke="#808488" stroke-width="1"/>
      <!-- Link Gap Shadow -->
      <line x1="170" y1="${y + 17}" x2="330" y2="${y + 17}" stroke="#484a4c" stroke-width="1.2"/>
    `).join('')}
  </g>
`);

saveLayer('strap-jubilee-steel.svg', `
  <g filter="url(#shadowDepth)">
    <!-- 5-Link Jubilee Bracelet with High-Polished Center Links -->
    ${[10, 36, 62, 88, 114, 386, 412, 438, 464, 490].map(y => `
      <!-- Outer Brushed Links -->
      <rect x="170" y="${y - 12}" width="25" height="24" rx="2" fill="url(#steelLugV)" stroke="#808488" stroke-width="0.8"/>
      <rect x="305" y="${y - 12}" width="25" height="24" rx="2" fill="url(#steelLugV)" stroke="#808488" stroke-width="0.8"/>
      <!-- 3 Mirror-Polished D-Shaped Center Links -->
      <rect x="198" y="${y - 12}" width="32" height="24" rx="3" fill="#ffffff" stroke="#9da2a8" stroke-width="0.8"/>
      <rect x="233" y="${y - 12}" width="34" height="24" rx="3" fill="url(#brushedSteel)" stroke="#9da2a8" stroke-width="0.8"/>
      <rect x="270" y="${y - 12}" width="32" height="24" rx="3" fill="#ffffff" stroke="#9da2a8" stroke-width="0.8"/>
    `).join('')}
  </g>
`);

saveLayer('strap-president-gold.svg', `
  <g filter="url(#shadowDepth)">
    <!-- 18K Yellow Gold 3-Link Semicircular President Bracelet -->
    ${[10, 42, 74, 106, 394, 426, 458, 490].map(y => `
      <rect x="170" y="${y - 14}" width="30" height="30" rx="3" fill="url(#gold18k)" stroke="#8c6405" stroke-width="1"/>
      <rect x="300" y="${y - 14}" width="30" height="30" rx="3" fill="url(#gold18k)" stroke="#8c6405" stroke-width="1"/>
      <!-- Polished Semicircular Crown Center Link -->
      <rect x="203" y="${y - 14}" width="94" height="30" rx="4" fill="url(#gold18k)" stroke="#735308" stroke-width="1"/>
      <line x1="203" y1="${y}" x2="297" y2="${y}" stroke="#fff8db" stroke-width="1.5" opacity="0.6"/>
    `).join('')}
  </g>
`);

saveLayer('strap-leather-tan.svg', `
  <g filter="url(#shadowDepth)">
    <!-- Italian Tuscan Tan Leather Strap -->
    <rect x="175" y="10" width="150" height="140" rx="6" fill="#a46838" stroke="#683d1c" stroke-width="1.5"/>
    <rect x="175" y="350" width="150" height="140" rx="6" fill="#a46838" stroke="#683d1c" stroke-width="1.5"/>
    <!-- Subtle Leather Grain Shader -->
    <rect x="175" y="10" width="150" height="140" fill="url(#vintageCream)" opacity="0.12"/>
    <rect x="175" y="350" width="150" height="140" fill="url(#vintageCream)" opacity="0.12"/>
    <!-- Handcrafted Saddle Stitching in Ivory Thread -->
    <line x1="184" y1="15" x2="184" y2="145" stroke="#fdfbf5" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="316" y1="15" x2="316" y2="145" stroke="#fdfbf5" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="184" y1="355" x2="184" y2="485" stroke="#fdfbf5" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="316" y1="355" x2="316" y2="485" stroke="#fdfbf5" stroke-width="2" stroke-dasharray="4 4"/>
  </g>
`);

saveLayer('strap-leather-black.svg', `
  <g filter="url(#shadowDepth)">
    <!-- Shell Cordovan Black Dress Leather -->
    <rect x="175" y="10" width="150" height="140" rx="6" fill="#1c1d1f" stroke="#0a0a0b" stroke-width="1.5"/>
    <rect x="175" y="350" width="150" height="140" rx="6" fill="#1c1d1f" stroke="#0a0a0b" stroke-width="1.5"/>
    <line x1="184" y1="15" x2="184" y2="145" stroke="#4a4c50" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="316" y1="15" x2="316" y2="145" stroke="#4a4c50" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="184" y1="355" x2="184" y2="485" stroke="#4a4c50" stroke-width="2" stroke-dasharray="4 4"/>
    <line x1="316" y1="355" x2="316" y2="485" stroke="#4a4c50" stroke-width="2" stroke-dasharray="4 4"/>
  </g>
`);

saveLayer('strap-rubber-waffle.svg', `
  <g filter="url(#shadowDepth)">
    <!-- FKM Vulcanized Waffle Diver Strap -->
    <rect x="175" y="10" width="150" height="140" rx="4" fill="#202224" stroke="#111" stroke-width="1.5"/>
    <rect x="175" y="350" width="150" height="140" rx="4" fill="#202224" stroke="#111" stroke-width="1.5"/>
    <!-- Waffle Grid Pyramids Texture -->
    ${Array.from({ length: 6 }, (_, row) => Array.from({ length: 7 }, (_, col) => {
      const x = 188 + col * 18;
      const y = 20 + row * 20;
      return `<rect x="${x}" y="${y}" width="12" height="12" rx="1" fill="#111213" stroke="#2c2f33" stroke-width="0.8"/>`;
    })).flat().join('')}
    ${Array.from({ length: 6 }, (_, row) => Array.from({ length: 7 }, (_, col) => {
      const x = 188 + col * 18;
      const y = 360 + row * 20;
      return `<rect x="${x}" y="${y}" width="12" height="12" rx="1" fill="#111213" stroke="#2c2f33" stroke-width="0.8"/>`;
    })).flat().join('')}
  </g>
`);

saveLayer('strap-rubber-navy.svg', `
  <g filter="url(#shadowDepth)">
    <rect x="175" y="10" width="150" height="140" rx="4" fill="#132b50" stroke="#0a182d" stroke-width="1.5"/>
    <rect x="175" y="350" width="150" height="140" rx="4" fill="#132b50" stroke="#0a182d" stroke-width="1.5"/>
  </g>
`);

saveLayer('strap-milanese-mesh.svg', `
  <g filter="url(#shadowDepth)">
    <!-- Flexible Woven Shark Mesh Steel -->
    <rect x="175" y="10" width="150" height="140" fill="url(#brushedSteel)" stroke="#808488" stroke-width="1"/>
    <rect x="175" y="350" width="150" height="140" fill="url(#brushedSteel)" stroke="#808488" stroke-width="1"/>
    ${Array.from({ length: 14 }, (_, i) => `
      <line x1="175" y1="${15 + i * 9}" x2="325" y2="${15 + i * 9}" stroke="#555" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="175" y1="${355 + i * 9}" x2="325" y2="${355 + i * 9}" stroke="#555" stroke-width="1" stroke-dasharray="3 3"/>
    `).join('')}
  </g>
`);

saveLayer('strap-nato-olive.svg', `
  <g filter="url(#shadowDepth)">
    <!-- Ballistic Nylon Olive Weave with Brushed Steel Keepers -->
    <rect x="175" y="0" width="150" height="500" fill="#3f4e38" stroke="#263121" stroke-width="1"/>
    <!-- Steel Hardware Keepers -->
    <rect x="170" y="45" width="160" height="10" rx="2" fill="url(#brushedSteel)" stroke="#555" stroke-width="1"/>
    <rect x="170" y="440" width="160" height="10" rx="2" fill="url(#brushedSteel)" stroke="#555" stroke-width="1"/>
  </g>
`);

saveLayer('strap-canvas-sand.svg', `
  <g filter="url(#shadowDepth)">
    <rect x="175" y="10" width="150" height="140" rx="4" fill="#c2ab87" stroke="#877457" stroke-width="1.2"/>
    <rect x="175" y="350" width="150" height="140" rx="4" fill="#c2ab87" stroke="#877457" stroke-width="1.2"/>
  </g>
`);

// ── 11. CASE BACKS (Exhibition Sapphire, Solid Steel, Wave Engraved) ──
saveLayer('caseback-sapphire-display.svg', `
  <!-- Exhibition Sapphire Screw-down Caseback -->
  <circle cx="250" cy="250" r="148" fill="url(#brushedSteel)" stroke="#777" stroke-width="2" filter="url(#shadowDepth)"/>
  <!-- Circular Technical Specification Engraving -->
  <circle cx="250" cy="250" r="132" fill="none" stroke="#555" stroke-width="1"/>
  <text x="250" y="130" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="7" font-weight="bold" letter-spacing="2" fill="#333">★ CHRONO BESPOKE ATELIER ★</text>
  <text x="250" y="375" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="6.5" font-weight="bold" letter-spacing="1.5" fill="#333">SAPPHIRE CRYSTAL • 200M WATER RESISTANT • STAINLESS STEEL 316L</text>
  <!-- Clear Sapphire Viewing Window -->
  <circle cx="250" cy="250" r="105" fill="#ffffff" fill-opacity="0.1" stroke="#333" stroke-width="2"/>
  <!-- Visible Caliber Rotor underneath -->
  <path d="M 160 250 A 90 90 0 0 1 340 250 Z" fill="url(#gold18k)" stroke="#735308" stroke-width="1.2"/>
  <circle cx="250" cy="250" r="22" fill="url(#brushedSteel)" stroke="#555" stroke-width="1"/>
`);

saveLayer('caseback-solid-steel.svg', `
  <circle cx="250" cy="250" r="148" fill="url(#brushedSteel)" stroke="#777" stroke-width="2" filter="url(#shadowDepth)"/>
  <!-- Deep Radial Circular Brushing Pattern -->
  ${[136, 122, 108, 94, 80, 66, 52].map(r => `
    <circle cx="250" cy="250" r="${r}" fill="none" stroke="#686c70" stroke-width="0.8" opacity="0.6"/>
  `).join('')}
  <!-- 6 Caseback Removal Notches for Horology Tool -->
  ${[0, 60, 120, 180, 240, 300].map(deg => {
    const rad = deg * Math.PI / 180;
    const x = 250 + 138 * Math.sin(rad);
    const y = 250 - 138 * Math.cos(rad);
    return `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#222" rx="1"/>`;
  }).join('')}
  <circle cx="250" cy="250" r="50" fill="url(#brushedSteel)" stroke="#555" stroke-width="1.5"/>
  <text x="250" y="246" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="bold" letter-spacing="2" fill="#222">CHRONO</text>
  <text x="250" y="258" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="6" font-weight="600" letter-spacing="1" fill="#444">MANUFACTURE</text>
`);

saveLayer('caseback-wave-engraved.svg', `
  <circle cx="250" cy="250" r="148" fill="url(#brushedSteel)" stroke="#777" stroke-width="2" filter="url(#shadowDepth)"/>
  <circle cx="250" cy="250" r="110" fill="#2b2d30" stroke="#555" stroke-width="1.5"/>
  <!-- Japanese Great Wave Embossed Medallion -->
  <path d="M 160 270 Q 190 220 220 250 T 280 230 T 340 260 L 340 310 L 160 310 Z" fill="url(#brushedSteel)" stroke="#888" stroke-width="1.2"/>
  <circle cx="250" cy="210" r="24" fill="none" stroke="url(#gold18k)" stroke-width="2"/>
`);

// ── 12. ENGRAVINGS ──
saveLayer('engraving-custom.svg', `
  <!-- Laser engraving placeholder layer (Text rendered dynamically via WatchViewer overlay) -->
  <g opacity="0.9"></g>
`);

console.log('Photorealistic Swiss watchmaker layers generation complete!');
