const fs = require('fs');

async function fetchPage() {
  try {
    const res = await fetch('https://www.watchmodcustom.com/configurator/32-basic-watch.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    console.log('HTML length:', html.length);
    fs.writeFileSync('scripts/wmc-full.html', html);

    // Find all image URLs ending in png or webp
    const pngMatches = html.match(/https?:\/\/[^"'<>\s]+\.(?:png|webp)/gi) || [];
    console.log('PNG/WebP count:', pngMatches.length);
    const unq = [...new Set(pngMatches.map(u => u.replace(/\\/g, '')))];
    console.log('Unique PNG/WebP (first 50):');
    unq.slice(0, 50).forEach(u => console.log(' -', u));

    // Also look for relative paths like /img/ or /upload/ or /modules/
    const rel = html.match(/["'](\/(?:img|upload|modules)[^"']+\.(?:png|webp|jpg))["']/gi) || [];
    console.log('Relative paths count:', rel.length);
    const unqRel = [...new Set(rel.map(r => r.slice(1, -1)))];
    console.log('Unique relative (first 50):');
    unqRel.slice(0, 50).forEach(u => console.log(' -', 'https://www.watchmodcustom.com' + u));
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

fetchPage();
