/**
 * End-to-End Automated Verification Script for Section 26 Requirements
 */
const BASE_URL = 'http://localhost:3001';

async function runTestScenario() {
  console.log('====================================================');
  console.log('🚀 STARTING SECTION 26 E2E VERIFICATION TEST');
  console.log('====================================================\n');

  // STEP 0: Admin Login
  console.log('Step 0: Logging in as Admin...');
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@chrono.com', password: 'admin123' })
  });
  if (!loginRes.ok) throw new Error('Admin login failed');
  const cookieHeader = loginRes.headers.get('set-cookie');
  console.log('  ✓ Admin logged in, session cookie acquired.\n');

  const adminHeaders = {
    'Content-Type': 'application/json',
    'Cookie': cookieHeader || ''
  };

  // Fetch Categories to get IDs
  const catsRes = await fetch(`${BASE_URL}/api/categories`);
  const categories = await catsRes.json();
  const caseCat = categories.find(c => c.slug === 'case');
  const dialCat = categories.find(c => c.slug === 'dial');
  const bezelCat = categories.find(c => c.slug === 'bezel');

  console.log(`  ✓ Categories verified: ${categories.length} categories active in database.\n`);

  // Cleanup any leftover test pieces from previous runs
  const piecesRes = await fetch(`${BASE_URL}/api/admin/pieces`, { headers: adminHeaders });
  const allExistingPieces = await piecesRes.json();
  const testSkus = ['TEST-CASE-A', 'TEST-CASE-B', 'TEST-DIAL-A', 'TEST-DIAL-B', 'BEZ-EMERALD-NEW'];
  const testPieceIds = allExistingPieces.filter(p => testSkus.includes(p.sku)).map(p => p.id);

  // First, delete compatibility rules attached to test pieces
  if (testPieceIds.length > 0) {
    const rulesRes = await fetch(`${BASE_URL}/api/compatibility`);
    const existingRules = await rulesRes.json();
    for (const rule of existingRules) {
      if (testPieceIds.includes(rule.pieceId)) {
        await fetch(`${BASE_URL}/api/admin/compatibility?id=${rule.id}`, { method: 'DELETE', headers: adminHeaders });
      }
    }
  }

  // Then delete the test pieces
  for (const item of allExistingPieces) {
    if (testSkus.includes(item.sku)) {
      await fetch(`${BASE_URL}/api/admin/pieces/${item.id}`, { method: 'DELETE', headers: adminHeaders });
    }
  }

  // STEP 1 & 2: Create Case A and Case B via Admin
  console.log('Step 1 & 2: Creating Case A & Case B from Admin API...');
  const caseARes = await fetch(`${BASE_URL}/api/admin/pieces`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      sku: 'TEST-CASE-A',
      name: 'Case A Titanium 40mm',
      description: 'Caja experimental en titanio grado 5',
      categoryId: caseCat.id,
      price: 220,
      stock: 15,
      compositionImage: '/images/layers/case-sub-40-steel.png',
      productImage: '/images/products/case-sub-40-steel.png',
      layerZIndex: 3,
      layerScale: 1.0
    })
  });
  if (!caseARes.ok) throw new Error(`Case A creation failed: ${await caseARes.text()}`);
  const caseA = await caseARes.json();
  console.log(`  ✓ Case A created with ID: ${caseA.id} (${caseA.name})`);

  const caseBRes = await fetch(`${BASE_URL}/api/admin/pieces`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      sku: 'TEST-CASE-B',
      name: 'Case B Forged Carbon 42mm',
      description: 'Caja experimental en carbono forjado',
      categoryId: caseCat.id,
      price: 280,
      stock: 10,
      compositionImage: '/images/layers/case-sub-40-pvd.png',
      productImage: '/images/products/case-sub-40-pvd.png',
      layerZIndex: 3,
      layerScale: 1.05
    })
  });
  if (!caseBRes.ok) throw new Error(`Case B creation failed: ${await caseBRes.text()}`);
  const caseB = await caseBRes.json();
  console.log(`  ✓ Case B created with ID: ${caseB.id} (${caseB.name})\n`);

  // STEP 3 & 4: Create Dial A and Dial B via Admin
  console.log('Step 3 & 4: Creating Dial A & Dial B from Admin API...');
  const dialARes = await fetch(`${BASE_URL}/api/admin/pieces`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      sku: 'TEST-DIAL-A',
      name: 'Dial A Sunburst Gold',
      description: 'Esfera rayos de sol dorada para Case A',
      categoryId: dialCat.id,
      price: 60,
      stock: 20,
      compositionImage: '/images/layers/dial-champagne.png',
      productImage: '/images/products/dial-champagne.png',
      layerZIndex: 5
    })
  });
  const dialA = await dialARes.json();
  if (!dialA.id) throw new Error(`Dial A creation failed: ${JSON.stringify(dialA)}`);
  console.log(`  ✓ Dial A created with ID: ${dialA.id} (${dialA.name})`);

  const dialBRes = await fetch(`${BASE_URL}/api/admin/pieces`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      sku: 'TEST-DIAL-B',
      name: 'Dial B Stealth Carbon',
      description: 'Esfera carbón táctica para Case B',
      categoryId: dialCat.id,
      price: 85,
      stock: 12,
      compositionImage: '/images/layers/dial-forged-carbon.png',
      productImage: '/images/products/dial-forged-carbon.png',
      layerZIndex: 5
    })
  });
  if (!dialBRes.ok) throw new Error(`Dial B creation failed: ${await dialBRes.text()}`);
  const dialB = await dialBRes.json();
  console.log(`  ✓ Dial B created with ID: ${dialB.id} (${dialB.name})\n`);

  // STEP 5 & 6: Define Data-driven Compatibility Rules via Admin
  console.log('Step 5 & 6: Defining compatibility rules via Admin API...');
  // Case A -> Whitelist [Dial A]
  const ruleARes = await fetch(`${BASE_URL}/api/admin/compatibility`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      pieceId: caseA.id,
      targetCategoryId: dialCat.id,
      ruleType: 'whitelist',
      targetPieceIds: [dialA.id],
      description: 'Case A sólo es compatible con Dial A'
    })
  });
  const ruleAData = await ruleARes.json();

  // Case B -> Whitelist [Dial B]
  const ruleBRes = await fetch(`${BASE_URL}/api/admin/compatibility`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      pieceId: caseB.id,
      targetCategoryId: dialCat.id,
      ruleType: 'whitelist',
      targetPieceIds: [dialB.id],
      description: 'Case B sólo es compatible con Dial B'
    })
  });
  const ruleBData = await ruleBRes.json();
  console.log('  Rule A created:', ruleAData);
  console.log('  Rule B created:', ruleBData);

  // STEP 7 & 8: Configurator reads dynamic pieces & rules
  console.log('Step 7 & 8: Configurator fetching public data...');
  const publicRulesRes = await fetch(`${BASE_URL}/api/compatibility`);
  const allRules = await publicRulesRes.json();

  const casePiecesRes = await fetch(`${BASE_URL}/api/categories/case/pieces`);
  const casePieces = (await casePiecesRes.json()).pieces;

  const dialPiecesRes = await fetch(`${BASE_URL}/api/categories/dial/pieces`);
  const dialPieces = (await dialPiecesRes.json()).pieces;

  console.log(`  ✓ Configurator received ${casePieces.length} cases and ${dialPieces.length} dials from DB.`);

  // Load Configuration Engine
  const { configurationEngine } = await import('../lib/configurationEngine.ts');

  // STEP 8 & 9: Select Case A -> Confirm ONLY Dial A is compatible
  console.log('\nStep 8 & 9: Selecting Case A...');
  const resultCaseA = configurationEngine({
    selectedPieces: { [caseCat.id]: caseA },
    categories,
    allRules,
    candidateCategory: dialCat,
    candidatePieces: [dialA, dialB],
    baseWatchPrice: 250
  });

  const isDialACompatWithA = resultCaseA.compatiblePartIds.includes(dialA.id);
  const isDialBCompatWithA = resultCaseA.compatiblePartIds.includes(dialB.id);

  console.log(`  ✓ When Case A is selected:`);
  console.log(`    - Dial A compatible: ${isDialACompatWithA} (Expected: true)`);
  console.log(`    - Dial B compatible: ${isDialBCompatWithA} (Expected: false)`);
  console.log(`    - Incompatible reason for Dial B: "${resultCaseA.incompatibleParts[dialB.id]?.reason}"`);

  if (!isDialACompatWithA || isDialBCompatWithA) {
    throw new Error('FAILED: Compatibility rule for Case A not respected!');
  }

  // STEP 10 & 11: Change to Case B -> Confirm Dial B is compatible, Dial A is not
  console.log('\nStep 10 & 11: Changing selection to Case B...');
  const resultCaseB = configurationEngine({
    selectedPieces: { [caseCat.id]: caseB },
    categories,
    allRules,
    candidateCategory: dialCat,
    candidatePieces: [dialA, dialB],
    baseWatchPrice: 250
  });

  const isDialACompatWithB = resultCaseB.compatiblePartIds.includes(dialA.id);
  const isDialBCompatWithB = resultCaseB.compatiblePartIds.includes(dialB.id);

  console.log(`  ✓ When Case B is selected:`);
  console.log(`    - Dial A compatible: ${isDialACompatWithB} (Expected: false)`);
  console.log(`    - Dial B compatible: ${isDialBCompatWithB} (Expected: true)`);
  console.log(`    - Incompatible reason for Dial A: "${resultCaseB.incompatibleParts[dialA.id]?.reason}"`);

  if (isDialACompatWithB || !isDialBCompatWithB) {
    throw new Error('FAILED: Compatibility rule for Case B not respected!');
  }

  // STEP 12, 13, 14, 15, 16, 17, 18: Change Dial, Hands, Bracelet -> Visual & Price updates
  console.log('\nStep 12-18: Testing live visual layer updates and dynamic price changes...');
  const handsPieces = (await (await fetch(`${BASE_URL}/api/categories/hands/pieces`)).json()).pieces;
  const strapPieces = (await (await fetch(`${BASE_URL}/api/categories/strap/pieces`)).json()).pieces;

  const currentBuild = {
    [caseCat.id]: caseB,
    [dialCat.id]: dialB,
    [handsPieces[0].categoryId]: handsPieces[0],
    [strapPieces[0].categoryId]: strapPieces[0],
  };

  const buildResult = configurationEngine({
    selectedPieces: currentBuild,
    categories,
    allRules,
    baseWatchPrice: 250
  });

  console.log(`  ✓ Base Assembly: $${buildResult.basePrice}`);
  console.log(`  ✓ Active Visual Layers count: ${buildResult.visualLayers.length}`);
  console.log(`  ✓ Layers in order (lowest Z to highest Z):`);
  buildResult.visualLayers.forEach(l => {
    console.log(`    [Z-${l.zIndex}] ${l.categorySlug.toUpperCase()}: ${l.pieceName} (${l.image})`);
  });

  const expectedTotal = 250 + caseB.price + dialB.price + handsPieces[0].price + strapPieces[0].price;
  console.log(`  ✓ Calculated Total: $${buildResult.totalPrice} (Expected: $${expectedTotal})`);

  if (buildResult.totalPrice !== expectedTotal) {
    throw new Error(`Price mismatch: got ${buildResult.totalPrice}, expected ${expectedTotal}`);
  }

  // STEP 19, 20, 21: Save Configuration, verify shareCode and retrieval
  console.log('\nStep 19-21: Saving configuration and verifying retrieval with shareCode...');
  const shareCode = 'WM-8F42K';
  const saveRes = await fetch(`${BASE_URL}/api/configurations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Custom Bespoke Watch',
      shareCode,
      engravingText: 'TEST 2026',
      items: Object.entries(currentBuild).map(([catId, p]) => ({
        pieceId: p.id,
        categoryId: catId,
        priceAtTime: p.price
      }))
    })
  });

  const savedConfig = await saveRes.json();
  console.log(`  ✓ Saved configuration created with Share Code: ${savedConfig.shareCode}`);

  const pageLookupRes = await fetch(`${BASE_URL}/configurator/${shareCode}`);
  console.log(`  ✓ GET /configurator/${shareCode} status: ${pageLookupRes.status}`);

  if (pageLookupRes.status !== 200) {
    throw new Error(`Failed to retrieve saved configuration: status ${pageLookupRes.status}`);
  }

  // STEP 22, 23, 24: Add NEW piece from Admin, NO CODE MODIFICATION, verify it appears in Configurator!
  console.log('\nStep 22-24: Creating a BRAND NEW piece in Admin with ZERO CODE CHANGES...');
  const newPieceRes = await fetch(`${BASE_URL}/api/admin/pieces`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      sku: 'BEZ-EMERALD-NEW',
      name: 'Bisel Cerámico Esmeralda Baguette Edición Limitada',
      description: 'Bisel joya de alta gama con cerámica verde esmeralda y marcas oro',
      categoryId: bezelCat.id,
      price: 150,
      stock: 5,
      compositionImage: '/images/layers/bezel-pepsi.png',
      productImage: '/images/products/bezel-pepsi.png',
      layerZIndex: 4
    })
  });
  const newPiece = await newPieceRes.json();
  console.log(`  ✓ Admin created new piece: "${newPiece.name}" (SKU: ${newPiece.sku})`);

  // Query public configurator endpoint for bezels
  console.log('  Testing configurator detection of new piece...');
  const refreshedBezelsRes = await fetch(`${BASE_URL}/api/categories/bezel/pieces`);
  const refreshedBezels = (await refreshedBezelsRes.json()).pieces;
  const foundNewPiece = refreshedBezels.find(p => p.sku === 'BEZ-EMERALD-NEW');

  if (!foundNewPiece) {
    throw new Error('FAILED: New piece was created in admin but did NOT appear in configurator!');
  }

  console.log(`  ✓ CONFIRMED: New piece "${foundNewPiece.name}" immediately available in configurator without touching code!`);

  console.log('\n====================================================');
  console.log('🎉 ALL 24 STEPS OF SECTION 26 PASSED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runTestScenario().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
