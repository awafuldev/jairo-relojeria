const fs = require('fs');
const html = fs.readFileSync('scripts/wmc-full.html', 'utf8');

const fieldRegex = /data-src="([^"]+)"[\s\S]*?(?:alt="([^"]*)"|title="([^"]*)")/gi;
let fMatch;
const all = [];
const categorized = {
  cases: [],
  dials: [],
  bezels: [],
  hands: [],
  bracelets: [],
  crystals: [],
  crowns: [],
  others: []
};

while ((fMatch = fieldRegex.exec(html)) !== null) {
  const src = fMatch[1].trim();
  const name = (fMatch[2] || fMatch[3] || '').trim();
  if (!name || name === 'Custom watch') continue;
  all.push({ name, src });

  const lower = name.toLowerCase();
  if (/case|sub|dj |explorer|pilot|nautilus|oak|sharp|pr steel|kx/i.test(lower)) {
    categorized.cases.push({ name, src });
  } else if (/dial|cadran|sunburst|marine|black|white|blue|green|champagne|carbon|mop|skeleton/i.test(lower)) {
    categorized.dials.push({ name, src });
  } else if (/bezel|insert|pepsi|batman/i.test(lower)) {
    categorized.bezels.push({ name, src });
  } else if (/hand|aiguille|mercedes|snowflake|sword|baton|cathedral/i.test(lower)) {
    categorized.hands.push({ name, src });
  } else if (/bracelet|strap|oyster|jubilee|rubber|leather|nato|president|mesh|canvas/i.test(lower)) {
    categorized.bracelets.push({ name, src });
  } else if (/glass|crystal|sapphire|verre/i.test(lower)) {
    categorized.crystals.push({ name, src });
  } else if (/crown|couronne/i.test(lower)) {
    categorized.crowns.push({ name, src });
  } else {
    categorized.others.push({ name, src });
  }
}

console.log('Total valid items:', all.length);
console.log('Categories count:');
Object.entries(categorized).forEach(([k, v]) => console.log(`  ${k}: ${v.length}`));

console.log('\n--- SAMPLE CASES (5) ---');
categorized.cases.slice(0, 5).forEach(c => console.log('  ', c.name, '=>', c.src));

console.log('\n--- SAMPLE DIALS (10) ---');
categorized.dials.slice(0, 10).forEach(d => console.log('  ', d.name, '=>', d.src));

console.log('\n--- SAMPLE HANDS (5) ---');
categorized.hands.slice(0, 5).forEach(h => console.log('  ', h.name, '=>', h.src));

console.log('\n--- SAMPLE BRACELETS (5) ---');
categorized.bracelets.slice(0, 5).forEach(b => console.log('  ', b.name, '=>', b.src));

console.log('\n--- SAMPLE BEZELS (5) ---');
categorized.bezels.slice(0, 5).forEach(b => console.log('  ', b.name, '=>', b.src));

console.log('\n--- SAMPLE OTHERS (10) ---');
categorized.others.slice(0, 10).forEach(o => console.log('  ', o.name, '=>', o.src));
