const fs = require('fs');
const path = require('path');
const line = "export const dynamic = 'force-dynamic'\n";

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) walk(fp);
    else if (f === 'page.tsx') {
      let content = fs.readFileSync(fp, 'utf8');
      if (!content.includes('force-dynamic')) {
        fs.writeFileSync(fp, line + content, 'utf8');
        console.log('FIXED:', fp.replace(process.cwd(), ''));
      } else {
        console.log('OK:', fp.replace(process.cwd(), ''));
      }
    }
  }
}

walk(path.join(process.cwd(), 'app'));
console.log('=== ALL DONE ===');
