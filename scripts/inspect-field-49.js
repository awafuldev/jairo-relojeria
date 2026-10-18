const fs = require('fs');
const html = fs.readFileSync('scripts/wmc-full.html', 'utf8');

const regex = /https?:\/\/[^\s"'<>]*(?:back|caseback|fond|sapphire|glass|crystal)[^\s"'<>]*\.(?:jpg|png|webp)/gi;
const matches = [...new Set(html.match(regex) || [])];
console.log('Matches for back/caseback/sapphire/glass/crystal:');
matches.forEach(m => console.log(' -', m));
