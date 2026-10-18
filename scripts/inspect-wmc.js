async function checkWmc() {
  try {
    const res = await fetch('https://www.watchmodcustom.com/module/ndk_advanced_custom_fields/createndkcsfields?ajax=1&id_product=32');
    const text = await res.text();
    console.log('AJAX response length:', text.length);
    const regex = /https?:\/\/[^"'<>\s]+\.(?:png|webp|jpg|jpeg)/gi;
    const matches = text.match(regex) || [];
    const unique = [...new Set(matches.map(m => m.replace(/\\/g, '')))];
    console.log('Total URLs found:', matches.length);
    console.log('Unique images:');
    unique.slice(0, 50).forEach(u => console.log(' -', u));

    // Also check for relative upload paths
    const relRegex = /\/upload\/[a-zA-Z0-9_\-\.\/]+\.(?:png|webp|jpg)/gi;
    const relMatches = text.match(relRegex) || [];
    console.log('\nRelative upload matches:', relMatches.length);
    const uniqueRel = [...new Set(relMatches)];
    uniqueRel.slice(0, 50).forEach(u => console.log(' -', 'https://www.watchmodcustom.com' + u));
  } catch (e) {
    console.error('Error fetching WMC:', e.message);
  }
}

checkWmc();
