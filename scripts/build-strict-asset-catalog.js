const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'wmc-full.html'), 'utf8');

// Parse items by data-group
const itemsByGroup = {};

// Regex for img and option tags
const tagRegex = /<(?:img|option)[^>]*data-group="(\d+)"[^>]*>/gi;
let m;
while ((m = tagRegex.exec(html)) !== null) {
  const tag = m[0];
  const group = m[1];
  const srcM = tag.match(/data-src="([^"]+)"/i);
  const valM = tag.match(/(?:data-value|title|alt|value)="([^"]*)"/i);
  const thumbM = tag.match(/data-thumb="([^"]*)"/i);
  const zM = tag.match(/data-zindex="([^"]*)"/i);

  if (srcM && valM) {
    const src = srcM[1].trim();
    const name = valM[1].trim();
    const thumb = thumbM ? thumbM[1].trim() : '';
    const zIndex = zM ? zM[1].trim() : '';
    if (!name || name === 'select an option' || name === 'Custom watch') continue;

    if (!itemsByGroup[group]) itemsByGroup[group] = [];
    if (!itemsByGroup[group].find(it => it.src === src)) {
      // extract id from url, e.g. 741 from https://www.watchmodcustom.com/img/scenes/ndkcf/741.jpg
      const idMatch = src.match(/\/(\d+)\.jpg$/);
      const id = idMatch ? idMatch[1] : '';
      itemsByGroup[group].push({ id, name, src, thumb, zIndex });
    }
  }
}

console.log('--- ALL GROUPS CATALOG ---');
for (const [gid, list] of Object.entries(itemsByGroup)) {
  console.log(`\nGroup ${gid} (${list.length} items):`);
  list.slice(0, 10).forEach(it => {
    console.log(`  [ID:${it.id}] "${it.name}" (z:${it.zIndex}) => ${it.src}`);
  });
}
