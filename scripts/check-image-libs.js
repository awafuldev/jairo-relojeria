const fs = require('fs');
const path = require('path');
// Check image libs

// Let's check what image libraries are installed in node_modules
const nm = path.join(__dirname, '..', 'node_modules');
const dirs = fs.readdirSync(nm);
console.log('Installed image libs:', dirs.filter(d => /png|image|sharp|jimp|canvas|pixel/i.test(d)));
