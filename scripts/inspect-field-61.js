const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'wmc-full.html'), 'utf8');

const pos = html.indexOf('data-field="61"');
if (pos !== -1) {
  console.log(html.substring(pos, pos + 2500));
}
