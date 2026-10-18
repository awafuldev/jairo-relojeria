const fs = require('fs');

async function testWmcImages() {
  const samples = [
    { type: 'case', url: 'https://www.watchmodcustom.com/img/scenes/ndkcf/293.jpg' },
    { type: 'dial', url: 'https://www.watchmodcustom.com/img/scenes/ndkcf/669.jpg' },
    { type: 'bezel', url: 'https://www.watchmodcustom.com/img/scenes/ndkcf/482.jpg' },
    { type: 'hands', url: 'https://www.watchmodcustom.com/img/scenes/ndkcf/804.jpg' },
    { type: 'bracelet', url: 'https://www.watchmodcustom.com/img/scenes/ndkcf/695.jpg' }
  ];

  for (const s of samples) {
    const res = await fetch(s.url);
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = `scripts/sample-${s.type}.jpg`;
    fs.writeFileSync(filename, buf);
    console.log(`Saved ${filename} (${buf.length} bytes)`);
  }

  // Also check the JavaScript on WatchModCustom that renders the layers
  // How does NDK Advanced Custom Fields overlay layers in the DOM?
  const html = fs.readFileSync('scripts/wmc-full.html', 'utf8');
  const ndkSceneMatch = html.match(/id="ndk_visual_layer[^"]*"|class="[^"]*ndk_layer[^"]*"|class="[^"]*scene[^"]*"/gi) || [];
  console.log('DOM scene/layer matches:', ndkSceneMatch);

  // Look for z-index or layer CSS rules in WMC html
  const zIndices = html.match(/z-index\s*:\s*\d+/gi) || [];
  console.log('z-indices found:', zIndices.slice(0, 10));
}

testWmcImages();
