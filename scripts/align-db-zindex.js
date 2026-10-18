const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORY_ZINDEX_MAP = {
  'caseback': 0,
  'movement': 1,
  'strap': 2,
  'case': 3,
  'dial': 4,
  'chapter-ring': 5,
  'bezel': 6,
  'hands': 7,
  'second-hand': 8,
  'crown': 9,
  'crystal': 10,
  'engraving': 11,
};

async function alignZIndex() {
  console.log('Aligning Category and Piece layerZIndex values...');
  
  for (const [slug, zIndex] of Object.entries(CATEGORY_ZINDEX_MAP)) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) continue;

    await prisma.category.update({
      where: { id: cat.id },
      data: { layerZIndex: zIndex },
    });

    const updatePieces = await prisma.piece.updateMany({
      where: { categoryId: cat.id },
      data: { layerZIndex: zIndex },
    });

    console.log(`  ✓ [${slug}] layerZIndex=${zIndex} (updated ${updatePieces.count} pieces)`);
  }

  console.log('\nAll Z-indices aligned successfully!');
}

alignZIndex().catch(console.error).finally(() => prisma.$disconnect());
