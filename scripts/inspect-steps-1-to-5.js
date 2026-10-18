const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectSteps1to5() {
  const categories = await prisma.category.findMany({
    where: { step: { lte: 5 } },
    orderBy: { step: 'asc' },
    include: { pieces: true }
  });

  for (const c of categories) {
    console.log(`Step ${String(c.step).padStart(2, '0')}: [${c.slug}] "${c.name}" -> Category layerZIndex: ${c.layerZIndex}`);
    for (const p of c.pieces) {
      console.log(`   - Piece "${p.name}" layerZIndex: ${p.layerZIndex}`);
    }
  }
}

inspectSteps1to5().catch(console.error).finally(() => prisma.$disconnect());
