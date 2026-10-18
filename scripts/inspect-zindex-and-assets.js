const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
  const categories = await prisma.category.findMany({
    orderBy: { step: 'asc' },
    include: {
      pieces: true
    }
  });

  console.log('=== CATEGORIES & Z-INDEX IN DB ===');
  for (const c of categories) {
    console.log(`Step ${String(c.step).padStart(2, '0')}: [${c.slug}] "${c.name}" -> Category layerZIndex: ${c.layerZIndex}`);
    for (const p of c.pieces) {
      console.log(`   - Piece "${p.name}" (SKU: ${p.sku})`);
      console.log(`       layerZIndex: ${p.layerZIndex}, scale: ${p.layerScale}, opacity: ${p.layerOpacity}`);
      console.log(`       compositionImage: ${p.compositionImage}`);
      console.log(`       productImage: ${p.productImage}`);
    }
  }
}

inspect().catch(console.error).finally(() => prisma.$disconnect());
