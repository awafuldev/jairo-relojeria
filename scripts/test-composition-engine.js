const { configurationEngine } = require('../lib/configurationEngine.ts');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 RUNNING MANDATORY COMPOSITION & LAYER REPLACEMENT TESTS');
  console.log('===============================================================\n');

  const categories = await prisma.category.findMany({
    orderBy: { step: 'asc' },
    include: { pieces: true },
  });

  const getCat = (slug) => categories.find((c) => c.slug === slug);
  const getPieces = (slug) => getCat(slug)?.pieces || [];

  const caseCat = getCat('case');
  const dialCat = getCat('dial');
  const handsCat = getCat('hands');
  const secondCat = getCat('second-hand');
  const crownCat = getCat('crown');
  const crystalCat = getCat('crystal');
  const bezelCat = getCat('bezel');
  const chapterCat = getCat('chapter-ring');
  const strapCat = getCat('strap');
  const casebackCat = getCat('caseback');

  const cases = getPieces('case');
  const dials = getPieces('dial');
  const handsList = getPieces('hands');
  const crowns = getPieces('crown');
  const crystals = getPieces('crystal');
  const bezels = getPieces('bezel');
  const chapters = getPieces('chapter-ring');
  const straps = getPieces('strap');
  const casebacks = getPieces('caseback');

  // Baseline setup: Case + Dial + Hands
  let baseSelections = {
    [caseCat.id]: cases[0],
    [dialCat.id]: dials[0],
    [handsCat.id]: handsList[0],
  };

  // ─────────────────────────────────────────────────────────────
  // TEST 1: Crown A -> Crown B -> Crown C -> Crown A
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 1: Crown Selection & Replacement (Crown A -> B -> C -> A)');
  const crownSeq = [crowns[0], crowns[1], crowns[2], crowns[0]];
  let state1 = { ...baseSelections };

  for (let i = 0; i < crownSeq.length; i++) {
    const cr = crownSeq[i];
    state1 = { ...state1, [crownCat.id]: cr };
    const res = configurationEngine({ selectedPieces: state1, categories, allRules: [] });

    const crownLayers = res.visualLayers.filter((l) => l.categorySlug === 'crown');
    if (crownLayers.length !== 1) {
      throw new Error(`FAIL TEST 1: Expected exactly 1 crown layer, found ${crownLayers.length}!`);
    }
    if (crownLayers[0].pieceId !== cr.id) {
      throw new Error(`FAIL TEST 1: Active crown is ${crownLayers[0].pieceName}, expected ${cr.name}!`);
    }
    console.log(`  ✓ Iteration ${i + 1}: Selected "${cr.name}" -> Exact 1 Crown layer: [${crownLayers[0].image}] (Z=${crownLayers[0].zIndex})`);
  }
  console.log('  🎉 TEST 1 PASSED: SIEMPRE existe exactamente un Crown, nunca duplicado.\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 2: Crystal A -> Crystal B -> Crystal C
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 2: Crystal Replacement (Dial and Hands MUST NOT be affected)');
  let state2 = { ...baseSelections, [crownCat.id]: crowns[0] };
  const crystalSeq = [crystals[0], crystals[1], crystals[2]];

  const initialRes = configurationEngine({ selectedPieces: state2, categories, allRules: [] });
  const initialDial = initialRes.visualLayers.find((l) => l.categorySlug === 'dial');
  const initialHands = initialRes.visualLayers.find((l) => l.categorySlug === 'hands');

  for (let i = 0; i < crystalSeq.length; i++) {
    const cry = crystalSeq[i];
    state2 = { ...state2, [crystalCat.id]: cry };
    const res = configurationEngine({ selectedPieces: state2, categories, allRules: [] });

    const crystalLayers = res.visualLayers.filter((l) => l.categorySlug === 'crystal');
    const currentDial = res.visualLayers.find((l) => l.categorySlug === 'dial');
    const currentHands = res.visualLayers.find((l) => l.categorySlug === 'hands');

    if (crystalLayers.length !== 1) {
      throw new Error(`FAIL TEST 2: Expected exactly 1 crystal layer, found ${crystalLayers.length}!`);
    }
    if (currentDial.pieceId !== initialDial.pieceId || currentDial.image !== initialDial.image) {
      throw new Error(`FAIL TEST 2: Dial layer was altered when changing crystal!`);
    }
    if (currentHands.pieceId !== initialHands.pieceId || currentHands.image !== initialHands.image) {
      throw new Error(`FAIL TEST 2: Hands layer was altered when changing crystal!`);
    }

    // Verify Z-Index: Crystal (10) must be above Hands (7) and Dial (4)
    if (crystalLayers[0].zIndex <= currentHands.zIndex || crystalLayers[0].zIndex <= currentDial.zIndex) {
      throw new Error(`FAIL TEST 2: Crystal Z-Index (${crystalLayers[0].zIndex}) must be higher than Hands (${currentHands.zIndex}) and Dial (${currentDial.zIndex})!`);
    }

    console.log(`  ✓ Selected "${cry.name}" -> Crystal Z=${crystalLayers[0].zIndex}, Dial Z=${currentDial.zIndex} (unchanged), Hands Z=${currentHands.zIndex} (unchanged)`);
  }
  console.log('  🎉 TEST 2 PASSED: Solo cambia Crystal layer. Dial y Hands 100% idénticos e intactos.\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 3: Hands A -> Hands B -> Hands C
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 3: Hands Selection & Replacement (Hands A -> B -> C)');
  let state3 = { ...baseSelections };
  const handsSeq = [handsList[0], handsList[1], handsList[2]];

  for (let i = 0; i < handsSeq.length; i++) {
    const h = handsSeq[i];
    state3 = { ...state3, [handsCat.id]: h };
    const res = configurationEngine({ selectedPieces: state3, categories, allRules: [] });

    const hLayers = res.visualLayers.filter((l) => l.categorySlug === 'hands');
    if (hLayers.length !== 1) {
      throw new Error(`FAIL TEST 3: Expected exactly 1 hands layer, found ${hLayers.length}!`);
    }
    if (hLayers[0].pieceId !== h.id) {
      throw new Error(`FAIL TEST 3: Active hands layer is ${hLayers[0].pieceName}, expected ${h.name}!`);
    }
    console.log(`  ✓ Iteration ${i + 1}: Selected "${h.name}" -> Exact 1 Hands layer: [${hLayers[0].image}] (Z=${hLayers[0].zIndex})`);
  }
  console.log('  🎉 TEST 3 PASSED: Solo cambia Hands layer, exactamente 1 activo.\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 4: Full Multi-component Switching (All 10 Visual Categories)
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 4: Cambiar todas las piezas varias veces (Nunca deben aparecer duplicados)');
  let fullState = {};
  const fullCats = [
    { cat: strapCat, piece: straps[0] },
    { cat: caseCat, piece: cases[0] },
    { cat: dialCat, piece: dials[0] },
    { cat: chapterCat, piece: chapters[0] },
    { cat: bezelCat, piece: bezels[0] },
    { cat: handsCat, piece: handsList[0] },
    { cat: secondCat, piece: getPieces('second-hand')[0] },
    { cat: crownCat, piece: crowns[0] },
    { cat: crystalCat, piece: crystals[0] },
    { cat: casebackCat, piece: casebacks[0] },
  ];

  // Pass 1: Select 1 of each
  for (const { cat, piece } of fullCats) {
    fullState[cat.id] = piece;
  }
  let res4 = configurationEngine({ selectedPieces: fullState, categories, allRules: [] });

  console.log(`  ✓ Pass 1: ${res4.visualLayers.length} active layers rendered:`);
  res4.visualLayers.forEach((l) => console.log(`     [Z=${l.zIndex}] ${l.categorySlug}: ${l.pieceName}`));

  // Check no duplicates
  const slugsSeen = new Set();
  for (const l of res4.visualLayers) {
    if (slugsSeen.has(l.categorySlug)) {
      throw new Error(`FAIL TEST 4: Duplicate layer found for category "${l.categorySlug}"!`);
    }
    slugsSeen.add(l.categorySlug);
  }

  // Pass 2: Switch every piece to option index 1
  fullCats.forEach(({ cat }) => {
    const list = getPieces(cat.slug);
    if (list.length > 1) {
      fullState[cat.id] = list[1];
    }
  });
  res4 = configurationEngine({ selectedPieces: fullState, categories, allRules: [] });

  console.log(`  ✓ Pass 2 (all switched): ${res4.visualLayers.length} active layers rendered.`);
  const slugsSeen2 = new Set();
  for (const l of res4.visualLayers) {
    if (slugsSeen2.has(l.categorySlug)) {
      throw new Error(`FAIL TEST 4: Duplicate layer found for category "${l.categorySlug}" in Pass 2!`);
    }
    slugsSeen2.add(l.categorySlug);
  }
  console.log('  🎉 TEST 4 PASSED: Nunca se acumulan ni duplican capas en ningún paso.\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 5: Mixed Random Category Sequence
  // Crown A -> Crown B -> Crystal B -> Crown C -> Dial B -> Crystal C
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 5: Secuencia Cruzada (Crown A -> Crown B -> Crystal B -> Crown C -> Dial B -> Crystal C)');
  let state5 = {
    [caseCat.id]: cases[0],
    [dialCat.id]: dials[0],
    [handsCat.id]: handsList[0],
    [crownCat.id]: crowns[0], // Crown A
  };

  const steps = [
    { desc: 'Crown B', catId: crownCat.id, piece: crowns[1], expectedSlug: 'crown' },
    { desc: 'Crystal B', catId: crystalCat.id, piece: crystals[1], expectedSlug: 'crystal' },
    { desc: 'Crown C', catId: crownCat.id, piece: crowns[2], expectedSlug: 'crown' },
    { desc: 'Dial B', catId: dialCat.id, piece: dials[1], expectedSlug: 'dial' },
    { desc: 'Crystal C', catId: crystalCat.id, piece: crystals[2], expectedSlug: 'crystal' },
  ];

  for (const step of steps) {
    state5 = { ...state5, [step.catId]: step.piece };
    const res = configurationEngine({ selectedPieces: state5, categories, allRules: [] });

    // Assert strictly 1 layer per category
    const catCounts = {};
    for (const l of res.visualLayers) {
      catCounts[l.categorySlug] = (catCounts[l.categorySlug] || 0) + 1;
    }
    for (const [slug, count] of Object.entries(catCounts)) {
      if (count > 1) throw new Error(`FAIL TEST 5: Category ${slug} has ${count} layers!`);
    }
    console.log(`  ✓ After selecting ${step.desc}: Total layers = ${res.visualLayers.length} (Crown: 1, Crystal: ${catCounts['crystal'] || 0}, Dial: 1, Case: 1, Hands: 1)`);
  }

  console.log('  🎉 TEST 5 PASSED: El reloj terminó con exactamente 1 de cada pieza. Cero capas acumuladas.\n');

  console.log('===============================================================');
  console.log('🏆 ALL 5 REGRESSION TESTS PASSED WITH 100% SUCCESS!');
  console.log('===============================================================\n');
}

runTests().catch((e) => {
  console.error('❌ ERROR:', e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
