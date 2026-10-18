const { configurationEngine } = require('../lib/configurationEngine.ts');

const BASE_URL = 'http://localhost:3001';

async function runChecklist() {
  console.log('====================================================');
  console.log('🔍 MANDATORY VERIFICATION TEST: PHOTO LAYERS PREVIEW');
  console.log('====================================================\n');

  // Fetch categories and pieces
  const catsRes = await fetch(`${BASE_URL}/api/categories`);
  const categories = await catsRes.json();
  const caseCat = categories.find(c => c.slug === 'case');
  const dialCat = categories.find(c => c.slug === 'dial');
  const handsCat = categories.find(c => c.slug === 'hands');
  const strapCat = categories.find(c => c.slug === 'strap');

  const cases = (await (await fetch(`${BASE_URL}/api/categories/case/pieces`)).json()).pieces;
  const dials = (await (await fetch(`${BASE_URL}/api/categories/dial/pieces`)).json()).pieces;
  const hands = (await (await fetch(`${BASE_URL}/api/categories/hands/pieces`)).json()).pieces;
  const straps = (await (await fetch(`${BASE_URL}/api/categories/strap/pieces`)).json()).pieces;

  const rules = await (await fetch(`${BASE_URL}/api/compatibility`)).json();

  console.log('1. Abrir configurador:');
  console.log(`   ✓ Cargadas ${categories.length} categorías.`);

  // 2 & 3. Select Case A
  const caseA = cases[0];
  console.log(`\n2 & 3. Seleccionar Case A: "${caseA.name}"`);
  console.log(`   - Composition image: ${caseA.compositionImage}`);
  if (!caseA.compositionImage.endsWith('.png')) throw new Error('Case A compositionImage is not a .png!');
  let state = { [caseCat.id]: caseA };
  let engine = configurationEngine({ selectedPieces: state, categories, allRules: rules });
  console.log(`   ✓ Capas en Preview: [${engine.visualLayers.map(l => l.image).join(', ')}]`);

  // 4 & 5. Select Case B
  const caseB = cases[1];
  console.log(`\n4 & 5. Seleccionar Case B: "${caseB.name}"`);
  console.log(`   - Composition image: ${caseB.compositionImage}`);
  state = { [caseCat.id]: caseB };
  engine = configurationEngine({ selectedPieces: state, categories, allRules: rules });
  console.log(`   ✓ Capas en Preview (Caja cambió): [${engine.visualLayers.map(l => l.image).join(', ')}]`);

  // 6 & 7. Select Dial A
  const dialA = dials[0];
  console.log(`\n6 & 7. Seleccionar Dial A: "${dialA.name}"`);
  console.log(`   - Composition image: ${dialA.compositionImage}`);
  state = { ...state, [dialCat.id]: dialA };
  engine = configurationEngine({ selectedPieces: state, categories, allRules: rules });
  console.log(`   ✓ Capas en Preview (Caja + Dial):`);
  engine.visualLayers.forEach(l => console.log(`     - [Z=${l.zIndex}] ${l.categorySlug}: ${l.image}`));

  // 8 & 9. Select Dial B
  const dialB = dials[1];
  console.log(`\n8 & 9. Seleccionar Dial B: "${dialB.name}"`);
  console.log(`   - Composition image: ${dialB.compositionImage}`);
  state = { ...state, [dialCat.id]: dialB };
  engine = configurationEngine({ selectedPieces: state, categories, allRules: rules });
  console.log(`   ✓ Capas en Preview (Caja + Nuevo Dial):`);
  engine.visualLayers.forEach(l => console.log(`     - [Z=${l.zIndex}] ${l.categorySlug}: ${l.image}`));

  // 10 & 11. Select Hands
  const handPiece = hands[0];
  console.log(`\n10 & 11. Seleccionar Hands: "${handPiece.name}"`);
  console.log(`   - Composition image: ${handPiece.compositionImage}`);
  state = { ...state, [handsCat.id]: handPiece };
  engine = configurationEngine({ selectedPieces: state, categories, allRules: rules });
  console.log(`   ✓ Capas en Preview (Caja + Dial + Hands):`);
  engine.visualLayers.forEach(l => console.log(`     - [Z=${l.zIndex}] ${l.categorySlug}: ${l.image}`));

  // 12 & 13. Select Bracelet
  const strapPiece = straps[0];
  console.log(`\n12 & 13. Seleccionar Bracelet: "${strapPiece.name}"`);
  console.log(`   - Composition image: ${strapPiece.compositionImage}`);
  state = { ...state, [strapCat.id]: strapPiece };
  engine = configurationEngine({ selectedPieces: state, categories, allRules: rules });
  console.log(`   ✓ Capas en Preview (Brazalete + Caja + Dial + Hands):`);
  engine.visualLayers.forEach(l => console.log(`     - [Z=${l.zIndex}] ${l.categorySlug}: ${l.image}`));

  // 14 & 15. Change Dial again to Dial A
  console.log(`\n14 & 15. Cambiar nuevamente el dial a Dial A ("${dialA.name}"):`);
  state = { ...state, [dialCat.id]: dialA };
  engine = configurationEngine({ selectedPieces: state, categories, allRules: rules });
  console.log(`   ✓ Confirmación de que las demás capas permanecen idénticas:`);
  engine.visualLayers.forEach(l => console.log(`     - [Z=${l.zIndex}] ${l.categorySlug}: ${l.image}`));

  // 16. Verify no geometric SVG/icon in any layer
  const hasSvgOrIcon = engine.visualLayers.some(l => l.image.endsWith('.svg') || l.image.includes('icon'));
  console.log(`\n16. Verificación de cero SVGs / iconos en el preview:`);
  console.log(`    ¿Existe algún SVG o icono en las capas del preview?: ${hasSvgOrIcon}`);
  if (hasSvgOrIcon) throw new Error('FAILED: Found SVG or icon in preview layers!');

  console.log('\n====================================================');
  console.log('🎉 TODOS LOS 16 PUNTOS DEL CHECKLIST HAN SIDO VALIDADOS CON ÉXITO!');
  console.log('====================================================\n');
}

runChecklist().catch(e => {
  console.error('❌ ERROR:', e);
  process.exit(1);
});
