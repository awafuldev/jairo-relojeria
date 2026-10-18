const fs = require('fs');
const html = fs.readFileSync('scripts/wmc-full.html', 'utf8');

// Map group ID to group Name from data-name / data-field
// e.g. data-name="second hands" ... data-field="27"
const groupDefs = {};
const groupDefRegex = /data-name="([^"]+)"[^>]*data-field="(\d+)"/gi;
let gdMatch;
while ((gdMatch = groupDefRegex.exec(html)) !== null) {
  groupDefs[gdMatch[2]] = gdMatch[1].trim();
}

console.log('Detected Group Definitions:', groupDefs);

// Find all items: either <img ... data-group="XX" data-src="..." data-value="..." ...>
// or <option ... data-group="XX" data-src="..." value="...">
const itemsByGroup = {};

// Regex for img items
const imgRegex = /<img[^>]*data-group="(\d+)"[^>]*>/gi;
let m;
while ((m = imgRegex.exec(html)) !== null) {
  const tag = m[0];
  const group = m[1];
  const srcM = tag.match(/data-src="([^"]+)"/i);
  const valM = tag.match(/(?:data-value|title|alt)="([^"]*)"/i);
  const thumbM = tag.match(/data-thumb="([^"]*)"/i);
  const zM = tag.match(/data-zindex="([^"]*)"/i);

  if (srcM) {
    const src = srcM[1].trim();
    const name = valM ? valM[1].trim() : '';
    const thumb = thumbM ? thumbM[1].trim() : '';
    const zIndex = zM ? zM[1].trim() : '';
    if (!itemsByGroup[group]) itemsByGroup[group] = [];
    if (!itemsByGroup[group].find(it => it.src === src)) {
      itemsByGroup[group].push({ name, src, thumb, zIndex });
    }
  }
}

// Regex for option items
const optRegex = /<option[^>]*data-group="(\d+)"[^>]*>/gi;
while ((m = optRegex.exec(html)) !== null) {
  const tag = m[0];
  const group = m[1];
  const srcM = tag.match(/data-src="([^"]+)"/i);
  const valM = tag.match(/value="([^"]*)"/i);
  const thumbM = tag.match(/data-thumb="([^"]*)"/i);
  const zM = tag.match(/data-zindex="([^"]*)"/i);

  if (srcM) {
    const src = srcM[1].trim();
    const name = valM ? valM[1].trim() : '';
    const thumb = thumbM ? thumbM[1].trim() : '';
    const zIndex = zM ? zM[1].trim() : '';
    if (!itemsByGroup[group]) itemsByGroup[group] = [];
    if (!itemsByGroup[group].find(it => it.src === src)) {
      itemsByGroup[group].push({ name, src, thumb, zIndex });
    }
  }
}

const targetGroups = ['30'];
for (const gid of targetGroups) {
  const items = itemsByGroup[gid] || [];
  const gName = groupDefs[gid] || 'unknown';
  console.log(`\n================ Group ${gid} [${gName}] (${items.length} items) ================`);
  items.forEach(it => {
    console.log(`  - "${it.name}" (z:${it.zIndex}) => ${it.src} (thumb: ${it.thumb})`);
  });
}
