const { configurationEngine } = require('../lib/configurationEngine.ts');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCrownSwitch() {
  const categories = await prisma.category.findMany({
    orderBy: { step: 'asc' },
    include: { pieces: true }
  });

  const caseCat = categories.find(c => c.slug === 'case');
  const dialCat = categories.find(c => c.slug === 'dial');
  const crownCat = categories.find(c => c.slug === 'crown');

  const casePiece = caseCat.pieces[0];
  const dialPiece = dialCat.pieces[0];
  const crownA = crownCat.pieces[0];
  const crownB = crownCat.pieces[1];

  console.log('Case:', casePiece.name);
  console.log('Crown A:', crownA.name, crownA.categoryId);
  console.log('Crown B:', crownB.name, crownB.categoryId);

  // Initial state: case + dial + crownA
  let state = {
    [caseCat.id]: casePiece,
    [dialCat.id]: dialPiece,
    [crownCat.id]: crownA,
  };

  let resA = configurationEngine({
    selectedPieces: state,
    categories,
    allRules: []
  });

  console.log('\n--- With Crown A ---');
  console.log('Total Layers:', resA.visualLayers.length);
  resA.visualLayers.forEach(l => console.log(`  [Z=${l.zIndex}] ${l.categorySlug}: ${l.pieceName} (${l.image})`));

  // Now user selects crownB
  state = {
    ...state,
    [crownCat.id]: crownB,
  };

  let resB = configurationEngine({
    selectedPieces: state,
    categories,
    allRules: []
  });

  console.log('\n--- With Crown B ---');
  console.log('Total Layers:', resB.visualLayers.length);
  resB.visualLayers.forEach(l => console.log(`  [Z=${l.zIndex}] ${l.categorySlug}: ${l.pieceName} (${l.image})`));
}

testCrownSwitch().catch(console.error).finally(() => prisma.$disconnect());
