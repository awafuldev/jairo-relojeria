const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'wmc-full.html'), 'utf8');

// Look for data-root="61" or mentions of 61 in dependencies
const deps = html.match(/[^<>\n]*(?:field_61|group_61|root="61")[^<>\n]*/gi) || [];
console.log('Mentions of field 61 / group 61:', deps.length);
deps.slice(0, 30).forEach(d => console.log(' ', d.trim()));

// Also check recap_group_61
const recapPos = html.indexOf('recap_group_61');
if (recapPos !== -1) {
  console.log('\n--- recap_group_61 ---');
  console.log(html.substring(recapPos - 100, recapPos + 400));
}
