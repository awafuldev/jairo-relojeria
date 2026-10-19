const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Check if this file is a client component
      if (content.includes("'use client'") || content.includes('"use client"')) {
        // Remove any dynamic exports
        content = content.replace(/export const dynamic = ['"][^'"]+['"]\r?\n?/g, '');
        // Clean up any extra use client directives
        content = content.replace(/['"]use client['"];?\r?\n?/g, '');
        // Trim leading spaces/newlines
        content = content.trimStart();
        // Prepend 'use client' at the absolute top (line 1)
        content = "'use client'\n\n" + content;
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed CLIENT component:', fullPath.replace(process.cwd(), ''));
      }
    }
  }
}

processDir(path.join(process.cwd(), 'app'));
console.log('=== CLIENT COMPONENTS FIXED ===');
