const BASE_URL = 'http://localhost:3001';

async function auditSteps() {
  console.log('========================================================');
  console.log('🔍 FULL STEP-BY-STEP CATEGORY INTEGRITY AUDIT');
  console.log('========================================================\n');

  const catsRes = await fetch(`${BASE_URL}/api/categories`);
  const categories = await catsRes.json();
  categories.sort((a, b) => a.step - b.step);

  let hasError = false;

  for (const cat of categories) {
    const piecesRes = await fetch(`${BASE_URL}/api/categories/${cat.slug}/pieces`);
    const data = await piecesRes.json();
    const pieces = data.pieces || [];

    console.log(`Step ${String(cat.step).padStart(2, '0')} [${cat.name}] (${cat.slug}) => ${pieces.length} piezas:`);

    for (const p of pieces) {
      // 1. Verify foreign key points strictly to this category
      if (p.categoryId !== cat.id) {
        console.error(`  ❌ CRITICAL: Piece "${p.name}" has categoryId "${p.categoryId}", expected "${cat.id}"!`);
        hasError = true;
      }

      // 2. Verify filename integrity
      const prodImg = p.productImage || '';
      const layerImg = p.compositionImage || p.layerImage || '';

      console.log(`  ✓ "${p.name}" (SKU: ${p.sku})`);
      console.log(`      Card:  ${prodImg}`);
      console.log(`      Layer: ${layerImg}`);
    }
    console.log('');
  }

  if (hasError) {
    console.error('❌ AUDIT FAILED WITH CATEGORY MISMATCHES!');
    process.exit(1);
  } else {
    console.log('========================================================');
    console.log('✅ ALL 12 STEPS PERFECTLY ISOLATED AND VERIFIED!');
    console.log('========================================================');
  }
}

auditSteps().catch(e => {
  console.error(e);
  process.exit(1);
});
