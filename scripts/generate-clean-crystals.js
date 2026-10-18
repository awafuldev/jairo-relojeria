const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const layersDir = path.join(__dirname, '..', 'public', 'images', 'layers');
const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');

async function createCrystals() {
  console.log('Generating authentic transparent sapphire crystal layers (1000x1000)...');

  // Dial opening is radius 170px centered at (500, 500)
  // 1. Flat Sapphire with Blue AR Coating
  const flatArSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Diagonal Specular Reflection Beam with Blue AR Coating -->
    <linearGradient id="arBeam" x1="0.2" y1="0.1" x2="0.8" y2="0.9">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.0"/>
      <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.0"/>
      <stop offset="48%" stop-color="#bae6fd" stop-opacity="0.18"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="53%" stop-color="#60a5fa" stop-opacity="0.22"/>
      <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.0"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
    </linearGradient>

    <!-- Subtle Bevel Edge Ring Reflection -->
    <radialGradient id="edgeRing" cx="0.45" cy="0.45" r="0.5">
      <stop offset="90%" stop-color="#ffffff" stop-opacity="0.0"/>
      <stop offset="96%" stop-color="#bae6fd" stop-opacity="0.25"/>
      <stop offset="99%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
    </radialGradient>
  </defs>

  <!-- Crystal Disk with AR reflection beam -->
  <circle cx="500" cy="500" r="170" fill="url(#arBeam)"/>
  <circle cx="500" cy="500" r="170" fill="url(#edgeRing)"/>
  <!-- Bevel Ring Specular Highlight -->
  <circle cx="500" cy="500" r="169" fill="none" stroke="#60a5fa" stroke-width="1.2" stroke-opacity="0.3"/>
</svg>`;

  // 2. Double-Domed Vintage Sapphire
  const doubleDomedSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Curved Perimeter Dome Reflections -->
    <radialGradient id="domeGlow" cx="0.35" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.0"/>
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.0"/>
      <stop offset="82%" stop-color="#e0f2fe" stop-opacity="0.12"/>
      <stop offset="94%" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="98%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
    </radialGradient>

    <!-- Curved Specular Arc Top Left -->
    <linearGradient id="domeArc" x1="0.1" y1="0.1" x2="0.6" y2="0.6">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="80%" stop-color="#ffffff" stop-opacity="0.0"/>
    </linearGradient>
  </defs>

  <!-- Double Domed Optical Depth Ring -->
  <circle cx="500" cy="500" r="171" fill="url(#domeGlow)"/>
  <!-- Outer Chamfer Ring -->
  <circle cx="500" cy="500" r="169.5" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.35"/>
</svg>`;

  // 3. Top-Hat Box Sapphire (Vintage High-Profile Stepped Glass)
  const topHatSvg = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Box Step Chamfer Reflection -->
    <radialGradient id="boxRing" cx="0.48" cy="0.48" r="0.5">
      <stop offset="86%" stop-color="#ffffff" stop-opacity="0.0"/>
      <stop offset="92%" stop-color="#f8fafc" stop-opacity="0.22"/>
      <stop offset="96%" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="98%" stop-color="#cbd5e1" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
    </radialGradient>
  </defs>

  <!-- Outer Stepped Edge Highlights -->
  <circle cx="500" cy="500" r="172" fill="url(#boxRing)"/>
  <circle cx="500" cy="500" r="168" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-opacity="0.4"/>
  <circle cx="500" cy="500" r="171" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-opacity="0.3"/>
</svg>`;

  const crystals = [
    { file: 'crystal-flat-ar-blue.png', svg: flatArSvg },
    { file: 'crystal-double-domed.png', svg: doubleDomedSvg },
    { file: 'crystal-top-hat-box.png', svg: topHatSvg },
  ];

  for (const c of crystals) {
    const layerPath = path.join(layersDir, c.file);
    await sharp(Buffer.from(c.svg))
      .png()
      .toFile(layerPath);

    console.log(`✓ Generated transparent layer: ${c.file}`);
  }
}

createCrystals().catch(console.error);
