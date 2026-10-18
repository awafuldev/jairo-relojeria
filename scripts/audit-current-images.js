const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pieces = await prisma.piece.findMany({
    include: { category: true }
  });

  console.log(`Total pieces in DB: ${pieces.length}`);
  const missing = [];
  const report = [];

  for (const p of pieces) {
    const prodRel = p.productImage || '';
    const layerRel = p.layerImage || '';

    const prodPath = path.join(__dirname, '..', 'public', prodRel.replace(/^\//, ''));
    const layerPath = path.join(__dirname, '..', 'public', layerRel.replace(/^\//, ''));

    const prodExists = fs.existsSync(prodPath);
    const layerExists = fs.existsSync(layerPath);

    const prodSize = prodExists ? fs.statSync(prodPath).size : 0;
    const layerSize = layerExists ? fs.statSync(layerPath).size : 0;

    report.push({
      category: p.category.name,
      catSlug: p.category.slug,
      name: p.name,
      prodRel,
      prodSize,
      layerRel,
      layerSize,
      prodExists,
      layerExists
    });

    if (!prodExists) missing.push(prodRel);
    if (!layerExists) missing.push(layerRel);
  }

  console.log('\nPieces by Category Summary:');
  const byCat = {};
  for (const r of report) {
    if (!byCat[r.category]) byCat[r.category] = [];
    byCat[r.category].push(r);
  }

  for (const [catName, list] of Object.entries(byCat)) {
    console.log(`\n=== [${catName}] (${list.length} pieces) ===`);
    list.forEach(item => {
      console.log(` - ${item.name}`);
      console.log(`     Product: ${item.prodRel} (${(item.prodSize / 1024).toFixed(1)} KB) [exists: ${item.prodExists}]`);
      console.log(`     Layer:   ${item.layerRel} (${(item.layerSize / 1024).toFixed(1)} KB) [exists: ${item.layerExists}]`);
    });
  }

  if (missing.length > 0) {
    console.log(`\nMISSING FILES (${missing.length}):`, missing);
  } else {
    console.log('\nAll referenced files physically exist on disk!');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
