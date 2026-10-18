const fs = require('fs');
const html = fs.readFileSync('scripts/wmc-full.html', 'utf8');

// Search for any .png or .jpg or .webp in html
const anyImg = html.match(/[a-zA-Z0-9_\-\.\/]+\.(?:png|webp|jpg|jpeg)/gi) || [];
console.log('Any image strings:', anyImg.length);
const unq = [...new Set(anyImg)];
console.log('Unique matches count:', unq.length);

// Filter images that look like watch parts (case, dial, hand, strap, bezel, etc.)
const watchParts = unq.filter(f => /dial|case|hand|bezel|bracelet|strap|crown|crystal/i.test(f));
console.log('\nWatch part image matches (first 40):');
watchParts.slice(0, 40).forEach(w => console.log(' -', w));

// Search for data attributes on elements, e.g. data-img, data-layer, data-svg, etc.
const dataAttrs = html.match(/data-[a-z\-]+=["'][^"']*["']/gi) || [];
console.log('\nData attributes:', dataAttrs.length);
const unqData = [...new Set(dataAttrs.filter(d => /img|src|cover|layer|part/i.test(d)))];
console.log('Relevant data attrs (first 30):');
unqData.slice(0, 30).forEach(d => console.log(' -', d));
