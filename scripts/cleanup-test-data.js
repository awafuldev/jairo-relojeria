// Cleanup test data from DB - handles FK constraints properly
const { PrismaClient } = require('../node_modules/@prisma/client/index.js');
const prisma = new PrismaClient();

const testSkus = ['TEST-CASE-A', 'TEST-CASE-B', 'TEST-DIAL-A', 'TEST-DIAL-B', 'BEZ-EMERALD-NEW'];

async function clean() {
  const pieces = await prisma.piece.findMany({ where: { sku: { in: testSkus } } });
  const ids = pieces.map(p => p.id);
  console.log('Found pieces to clean:', pieces.map(p => p.sku + ' id=' + p.id));

  if (ids.length === 0) {
    console.log('Nothing to clean!');
    return;
  }

  // Delete compatibility rules where these pieces are the source
  await prisma.compatibilityRule.deleteMany({ where: { pieceId: { in: ids } } });
  console.log('Deleted source rules');

  // Delete configuration items that reference these pieces
  await prisma.configurationItem.deleteMany({ where: { pieceId: { in: ids } } });
  console.log('Deleted configuration items');

  // Now delete the pieces
  const del = await prisma.piece.deleteMany({ where: { sku: { in: testSkus } } });
  console.log('Deleted', del.count, 'pieces');
}

clean()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
