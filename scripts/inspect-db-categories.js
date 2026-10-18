const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    orderBy: { step: 'asc' },
    include: {
      pieces: {
        select: { id: true, name: true, sku: true, categoryId: true, productImage: true, layerImage: true }
      }
    }
  });

  console.log('Total Categories:', categories.length);
  for (const cat of categories) {
    if (['movement', 'case'].includes(cat.slug)) {
      console.log(`\n--- ${cat.name} (${cat.slug}) [${cat.pieces.length} pieces] ---`);
      cat.pieces.forEach(p => console.log(`  [${p.id}] ${p.name} => prod: ${p.productImage} | layer: ${p.layerImage}`));
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
