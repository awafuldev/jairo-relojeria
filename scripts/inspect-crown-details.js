const fs = require('fs');
const path = require('path');

// Let's inspect the files in public/images/layers
const casePath = path.join(__dirname, '..', 'public', 'images', 'layers', 'case-sub-40-steel.png');
const crownPath = path.join(__dirname, '..', 'public', 'images', 'layers', 'crown-big-7mm.png');
const crownBlackPath = path.join(__dirname, '..', 'public', 'images', 'layers', 'crown-pvd-black.png');

console.log('case-sub-40-steel exists:', fs.existsSync(casePath), fs.statSync(casePath).size);
console.log('crown-big-7mm exists:', fs.existsSync(crownPath), fs.statSync(crownPath).size);
console.log('crown-pvd-black exists:', fs.existsSync(crownBlackPath), fs.statSync(crownBlackPath).size);

// Let's check what HTML in WMC does for cases and crowns
const html = fs.readFileSync(path.join(__dirname, 'wmc-full.html'), 'utf8');

// Find all occurrences of 741.jpg (Black Crown) and 738.jpg (Silver Crown) in WMC HTML
console.log('\n--- Occurrences of 741.jpg in WMC ---');
const m741 = html.match(/[^<>\n]*741\.jpg[^<>\n]*/gi) || [];
m741.forEach(m => console.log(' ', m.trim()));

console.log('\n--- Occurrences of 738.jpg in WMC ---');
const m738 = html.match(/[^<>\n]*738\.jpg[^<>\n]*/gi) || [];
m738.forEach(m => console.log(' ', m.trim()));

// Let's check the layer zindex and groups in WMC HTML for crown
const crownBlock = html.match(/<[^>]*data-name="crown"[^>]*>[\s\S]*?<\/div>/gi) || [];
console.log('\nCrown blocks found in WMC:', crownBlock.length);
