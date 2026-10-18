const fs = require('fs');
const html = fs.readFileSync('scripts/wmc-full.html', 'utf8');

// Find all occurrences of field or group classes
const matches = html.match(/class="[^"]*(?:field|group|step|accordion|tab)[^"]*"/gi) || [];
const uniqueClasses = [...new Set(matches)];
console.log('Unique field/group classes:');
uniqueClasses.slice(0, 30).forEach(c => console.log(' -', c));

// Find field labels / headings
const headings = html.match(/<(?:h2|h3|h4|h5|legend|p)[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/(?:h2|h3|h4|h5|legend|p)>/gi) || [];
console.log('\nHeadings found:');
headings.slice(0, 30).forEach(h => console.log(' -', h.replace(/<[^>]+>/g, '').trim()));
